'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/globals.css';
import { useUser } from '@/components/context/UserProfileContext';
import { useEffect } from 'react';
import { webSocketService } from '@/lib/utils/websockets';
import { NavigationConnected } from '@/components/nav-menu/nav-connected';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { PostTypeProvider } from '@/components/context/post-type-provider';
import { AppSidebar } from '@/components/nav-menu/app-sidebar';
import { useNotificationsStore } from '@/lib/state/notificationsStore';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export default function ConnectedLayout({ children }) {
    const { user } = useUser();
    const setupWebSocketListeners = useNotificationsStore(
        (state) => state.setupWebSocketListeners
    );

    useEffect(() => {
        if (user?.id) {
            const token =
                process.env.NODE_ENV === 'development'
                    ? localStorage.getItem('token')
                    : null;

            // Connect WebSocket when user is authenticated
            webSocketService.connect(user.id, token);

            // Setup notification listeners
            setupWebSocketListeners();

            // Cleanup on unmount
            return () => {
                // Add a disconnect method to your WebSocketService
                webSocketService.disconnect();
            };
        }
    }, [user?.id, setupWebSocketListeners]);
    return (
        <PostTypeProvider>
            <SidebarProvider>
                <div className="flex min-h-screen w-full">
                    <AppSidebar />
                    <div className="flex flex-col flex-1 w-full">
                        <div className="flex items-center my-2">
                            <SidebarTrigger className="text-primary dark:text-foreground" />
                            <div className="flex justify-center w-full">
                                <NavigationConnected />
                            </div>
                        </div>
                        <main className="flex-1 w-full bg-muted px-4 pb-4">
                            {children}
                        </main>
                    </div>
                </div>
            </SidebarProvider>
        </PostTypeProvider>
    );
}
