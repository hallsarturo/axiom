import { Analytics } from '@vercel/analytics/next';
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

                        <main className="flex-1">
                            {children}
                            <Analytics />
                        </main>

                        <footer className="relative z-10 flex flex-col items-center justify-center w-full gap-4 p-4 sm:p-8 text-white bg-gradient-to-b from-violet-600 to-violet-900 dark:from-zinc-900 dark:to-zinc-950 text-xs">
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
                                                href="/about"
                                                className="text-xs"
                                            >
                                                About
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
                                                href="/privacy-policy"
                                                className="text-xs"
                                            >
                                                Privacy Policy
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
                                                href="/terms-and-conditions"
                                                className="text-xs"
                                            >
                                                Terms & Conditions
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
                                                href="/legal-notice"
                                                className="text-xs"
                                            >
                                                Legal notice
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Logo section - */}
                            <div className="flex justify-center items-center w-full mt-0 -mb-3">
                                <Link href="/" className="text-xs">
                                    <Image
                                        src="/axiom_logo_white.png"
                                        width={75}
                                        height={50}
                                        alt="Axiom logo"
                                        className="my-0"
                                    />
                                </Link>
                            </div>
                            {/* Buy me a coffee section - */}
                            <div>
                                <a
                                    href="https://www.buymeacoffee.com/arturoproal"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Image
                                        src="https://cdn.buymeacoffee.com/buttons/v2/default-white.png"
                                        alt="Buy Me A Coffee"
                                        className="rounded-lg"
                                        width={103}
                                        height={30}
                                        // style={{
                                        //     height: '30px',
                                        //     width: '103px',
                                        // }}
                                    />
                                </a>
                            </div>

                            {/* Copyright section - */}
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
                                        © 2025 Arturo Proal Walls. All rights
                                        reserved.
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
