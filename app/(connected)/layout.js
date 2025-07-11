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
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased `}
            >
                <div className="fixed top-0 right-0 m-4 z-50">
                    <ModeToggle />
                </div>
                <div className="flex full-w justify-center mt-4 shadow-md">
                    <div className="fixed mb-4">
                        <NavigationConnected className="" />
                    </div>
                </div>
                {children}
            </body>
        </html>
    );
}