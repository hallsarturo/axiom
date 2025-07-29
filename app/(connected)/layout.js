import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/globals.css';
import { NavigationConnected } from '@/components/nav-menu/nav-connected';
import { ModeToggle } from '@/components/ui/themes/mode-toggle';

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
        <div className="bg-muted min-h-screen">
            <div className="fixed top-0 right-0 m-4 z-50">
                <ModeToggle />
            </div>
            <div className="fixed top-0 left-0 w-full z-40 bg-white dark:bg-background shadow-md border-b flex justify-center pt-4 pb-4">
                <NavigationConnected className="" />
            </div>
            <main className="pt-17">{children}</main>
        </div>
    );
}
