import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { UserProvider } from '@/components/context/UserProfileContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Toaster } from 'sonner';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
});

export const metadata = {
    title: 'Axiom',
    description: 'Knowledge centered network',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased `}
            >
                <UserProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        <Toaster />
                        <main>{children}</main>
                        <footer className="flex flex-col sm:flex-row justify-center items-center min-h-20 sm:min-h-35 w-full px-4 gap-2 p-4 sm:gap-8 text-white bg-gradient-to-br from-slate-950 to-slate-700 text-xs">
                            <div>
                                <Button
                                    className="bg-transparent text-xs px-2 py-1"
                                    variant="ghost"
                                    size="sm"
                                >
                                    <Link
                                        href="https://arturoproal.com"
                                        className="text-xs"
                                    >
                                        Arturo Proal Walls ©
                                    </Link>
                                </Button>
                            </div>
                            <div>
                                <Button
                                    className="bg-transparent text-xs px-2 py-1"
                                    variant="outline"
                                    size="xs"
                                >
                                    <Link href="/" className="text-xs">
                                        Buy me a cofee
                                    </Link>
                                </Button>
                            </div>
                            <div>
                                <Button
                                    className="bg-transparent text-xs px-2 py-1"
                                    variant="ghost"
                                    size="sm"
                                >
                                    <Link href="/" className="text-xs">
                                        Legal
                                    </Link>
                                </Button>
                            </div>
                        </footer>
                    </ThemeProvider>
                </UserProvider>
            </body>
        </html>
    );
}
