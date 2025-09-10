'use client';

import { useEffect } from 'react';
import { useNotificationsStore } from '@/lib/state/notificationsStore';
import { Badge } from '@/components/ui/badge';
import { Bell, MessageCircle, Reply, Heart, UserPlus } from 'lucide-react'; // Import all necessary icons
import {
    NavigationMenuContent,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { timeAgo } from '@/lib/utils/date';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { genInitials } from '@/lib/utils/strings';
import { normalizeImageUrl } from '@/lib/utils/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

// Define the missing function to handle different notification types
function getNotificationTypeDetails(notification) {
    switch (notification.type) {
        case 'comment':
            return {
                icon: MessageCircle,
                color: 'text-blue-500',
                link: `/posts/${notification.entityId}`,
            };
        case 'comment_reply':
            return {
                icon: Reply,
                color: 'text-green-500',
                link: `/posts/${notification.entityId}`,
            };
        case 'follow':
            return {
                icon: UserPlus,
                color: 'text-green-500',
                link: `/profile/${notification.senderId}`,
            };
        case 'like':
            return {
                icon: Heart,
                color: 'text-red-500',
                link: `/posts/${notification.entityId}`,
            };
        default:
            return {
                icon: Bell,
                color: 'text-gray-500',
                link: `/posts/${notification.entityId}`,
            };
    }
}

function NotificationItem({ notification }) {
    // Get icon and link based on notification type
    const {
        icon: Icon,
        color,
        link,
    } = getNotificationTypeDetails(notification);

    return (
        <Link
            href={link || '#'}
            className="block px-4 py-3 hover:bg-accent hover:text-primary-foreground transition-colors border-b border-border last:border-0"
        >
            <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                    <AvatarImage
                        src={normalizeImageUrl(
                            notification.sender?.userProfilePic ||
                                notification.sender?.photoUrl
                        )}
                    />
                    <AvatarFallback>
                        {genInitials(notification.sender?.username)}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        {Icon && <Icon className={`size-4 ${color}`} />}
                        <p className="text-sm line-clamp-2">
                            {notification.content}
                        </p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        {timeAgo(notification.createdAt)}
                    </p>
                </div>
            </div>
        </Link>
    );
}

export function NotificationDropdown({ userId }) {
    const { notifications, unseenCount, fetchNotifications, markAsSeen } =
        useNotificationsStore();

    const token =
        process.env.NODE_ENV === 'development' && typeof window !== 'undefined'
            ? localStorage.getItem('token')
            : null;

    // Fetch notifications on mount and set up polling
    useEffect(() => {
        if (userId) {
            fetchNotifications(token, userId);

            // Poll for new notifications every minute
            const interval = setInterval(() => {
                fetchNotifications(token, userId);
            }, 60000);

            return () => clearInterval(interval);
        }
    }, [fetchNotifications, userId, token]);

    return (
        <div className="">
            <NavigationMenuTrigger
                className="text-primary dark:text-foreground gap-2 cursor-pointer"
                onClick={markAsSeen}
            >
                {unseenCount > 0 && (
                    <Badge className="text-xs h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
                        {unseenCount}
                    </Badge>
                )}
                <Bell size="18" />
            </NavigationMenuTrigger>

            <NavigationMenuContent className="w-80 max-h-[70vh] overflow-y-auto z-100">
                <div className="py-2 px-3 border-b border-border ">
                    <div className="flex justify-between items-center">
                        <h3 className="font-medium">Notifications</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsSeen()}
                        >
                            Mark all as read
                        </Button>
                    </div>
                </div>

                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                        No notifications yet
                    </div>
                ) : (
                    <div>
                        {notifications.map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                            />
                        ))}
                    </div>
                )}

                <div className="p-2 border-t border-border">
                    <Link
                        href="/notifications"
                        className="block text-center text-sm text-primary hover:underline py-1"
                    >
                        View all notifications
                    </Link>
                </div>
            </NavigationMenuContent>
        </div>
    );
}
