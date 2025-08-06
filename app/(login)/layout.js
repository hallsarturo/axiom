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
        <>
            <div className="flex full-w justify-center mt-4 shadow-md">
                <div className="mb-4">
                    <NavigationMenuHome className="" />
                </div>
            </div>
            {children}
        </>
    );
}
