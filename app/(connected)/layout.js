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
            <div className="flex min-h-screen w-full">
                <AppSidebar />
                <div className="flex flex-col flex-1 w-full">
                    <div className="flex items-center my-2">
                        <SidebarTrigger />
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
    );
}
