import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { webSocketService } from '@/lib/utils/websockets';

export const useNotificationsStore = create(
    persist(
        (set, get) => ({
            notifications: [],
            unseenCount: 0,
            lastChecked: null,

            // Add a new notification
            addNotification: (notification) => {
                set((state) => ({
                    notifications: [notification, ...state.notifications],
                    unseenCount: state.unseenCount + 1,
                }));
            },

            // Mark notifications as seen
            markAsSeen: async () => {
                const { notifications } = get();
                const token =
                    process.env.NODE_ENV === 'development' &&
                    typeof window !== 'undefined'
                        ? localStorage.getItem('token')
                        : null;

                // Get unread notification IDs
                const unreadIds = notifications
                    .filter((n) => !n.isRead)
                    .map((n) => n.id);

                if (unreadIds.length === 0) return;

                // Call API to mark as read
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/read`,
                        {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                ...(token
                                    ? { Authorization: `Bearer ${token}` }
                                    : {}),
                            },
                            body: JSON.stringify({
                                notificationIds: unreadIds,
                            }),
                            credentials: 'include',
                        }
                    );

                    if (response.ok) {
                        // Update local state
                        set({
                            unseenCount: 0,
                            lastChecked: new Date(),
                            notifications: get().notifications.map((n) => ({
                                ...n,
                                isRead: true,
                            })),
                        });
                    }
                } catch (error) {
                    console.error(
                        'Error marking notifications as read:',
                        error
                    );
                }
            },

            // Clear specific or all notifications
            removeNotification: (id) => {
                set((state) => ({
                    notifications: state.notifications.filter(
                        (n) => n.id !== id
                    ),
                }));
            },

            // Fetch notifications from server
            fetchNotifications: async (token, userId) => {
                try {
                    // Loading state
                    set({ isLoading: true });

                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/api/notifications/user/${userId}`,
                        {
                            headers: token
                                ? { Authorization: `Bearer ${token}` }
                                : {},
                            credentials: 'include',
                        }
                    );

                    const data = await response.json();

                    if (response.ok) {
                        set({
                            notifications: data.notifications || [],
                            unseenCount: data.unseenCount || 0,
                            isLoading: false,
                        });
                    }
                } catch (error) {
                    console.error('Failed to fetch notifications:', error);
                    set({ isLoading: false });
                }
            },

            // Setup WebSocket listeners for real-time notifications
            setupWebSocketListeners: () => {
                const { addNotification } = get();

                // Listen for notification events from WebSocket
                webSocketService.addEventListener(
                    'notification',
                    (notificationData) => {
                        // Add the incoming notification to the store
                        addNotification(notificationData);

                        // Optional: Play sound or show browser notification
                        playNotificationSound();
                    }
                );

                // Listen for connection status
                webSocketService.addEventListener('connection', (data) => {
                    console.log('WebSocket connection status:', data.status);
                });
            },
        }),
        {
            name: 'notifications-storage', // unique name for localStorage
            partialize: (state) => ({
                notifications: state.notifications,
                unseenCount: state.unseenCount,
                lastChecked: state.lastChecked,
            }),
        }
    )
);
