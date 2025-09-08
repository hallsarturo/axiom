import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
          unseenCount: state.unseenCount + 1
        }));
      },
      
      // Mark notifications as seen
      markAsSeen: () => {
        set({
          unseenCount: 0,
          lastChecked: new Date()
        });
      },
      
      // Clear specific or all notifications
      removeNotification: (id) => {
        set((state) => ({
          notifications: state.notifications.filter(n => n.id !== id)
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
              headers: token ? { Authorization: `Bearer ${token}` } : {},
              credentials: 'include'
            }
          );
          
          const data = await response.json();
          
          if (response.ok) {
            set({
              notifications: data.notifications || [],
              unseenCount: data.unseenCount || 0,
              isLoading: false
            });
          }
        } catch (error) {
          console.error('Failed to fetch notifications:', error);
          set({ isLoading: false });
        }
      }
    }),
    {
      name: 'notifications-storage', // unique name for localStorage
      partialize: (state) => ({ 
        notifications: state.notifications,
        unseenCount: state.unseenCount,
        lastChecked: state.lastChecked 
      })
    }
  )
);