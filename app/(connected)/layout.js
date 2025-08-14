import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/globals.css';
import { NavigationConnected } from '@/components/nav-menu/nav-connected';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/nav-menu/app-sidebar';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export default function ConnectedLayout({ children }) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="bg-muted min-h-screen">
                <div className="fixed top-0 left-0 w-screen  z-40 bg-white dark:bg-background shadow-md border-b flex justify-center pt-4 pb-4 px-2 sm:px-4"></div>

                <main className="pt-17 pb-4">
                    <SidebarTrigger />
                    <NavigationConnected />
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
}
