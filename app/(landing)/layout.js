import { Geist, Geist_Mono } from 'next/font/google';
import '@/app/globals.css';
import { NavigationMenuHome } from '@/components/nav-menu/nav-home';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export default function LandingLayout({ children }) {
    return (
        <div className="relative min-h-screen justify-center">
            <div className="fixed flex justify-center top-0 left-0 w-full z-50 bg-white/0 dark:bg-background/80 backdrop-blur-sm shadow-md border-b border-gray-200 py-2">
                <NavigationMenuHome />
            </div>
            <div className="">{children}</div>
        </div>
    );
}
