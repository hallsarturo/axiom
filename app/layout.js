import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { UserProvider } from '@/components/context/UserProfileContext';
import Link from 'next/link';
import Image from 'next/image';
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
                className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
            >
                <UserProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem={false}
                        disableTransitionOnChange
                    >
                        <Toaster richColors />

                        <main className="flex-1">{children}</main>

                        <footer className="relative z-10 flex flex-col items-center justify-center min-h-20 w-full gap-4 p-4 sm:p-8 text-white bg-gradient-to-b from-violet-600 to-violet-900 dark:from-zinc-900 dark:to-zinc-950 text-xs">
                            {/* Buttons section */}
                            <div className="flex flex-col items-center w-full">
                                <div className="flex flex-col sm:flex-row w-full justify-center items-center gap-4 sm:gap-20">
                                    <div>
                                        <Button
                                            asChild
                                            className="text-white dark:text-primary-foreground text-xs px-2 py-1"
                                            variant="link"
                                            size="sm"
                                        >
                                            <Link
                                                href="https://arturoproal.com"
                                                className="text-xs"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Arturo Proal Walls ©
                                            </Link>
                                        </Button>
                                    </div>
                                    <div>
                                        <Button
                                            asChild
                                            className="bg-transparent text-xs px-2 py-1"
                                            variant="outline"
                                            size="xs"
                                        >
                                            <Link
                                                href="/"
                                                className="text-xs"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Buy me a coffee
                                            </Link>
                                        </Button>
                                    </div>
                                    <div>
                                        <Button
                                            asChild
                                            className="text-white dark:text-primary-foreground text-xs px-2 py-1"
                                            variant="link"
                                            size="sm"
                                        >
                                            <Link
                                                href="/"
                                                className="text-xs"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                Legal
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Logo section - now will appear below buttons */}
                            <div className="flex justify-center items-center w-full">
                                <Link href="/" className="text-xs">
                                    <Image
                                        src="/axiom_logo_white.png"
                                        width={75}
                                        height={50}
                                        alt="Axiom logo"
                                    />
                                </Link>
                            </div>
                        </footer>
                    </ThemeProvider>
                </UserProvider>
            </body>
        </html>
    );
}
