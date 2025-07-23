import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { UserProvider } from '@/components/context/UserProfileContext';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

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
                        {children}
                        <footer className="flex flex-row justify-center items-center min-h-35 text-white bg-gradient-to-br  from-slate-950 to-slate-700">
                            <div className="mr-25">
                                <Button
                                    className="bg-transparent"
                                    variant="ghost"
                                >
                                    {/* remember to Link to my website */}

                                    <Link href="https://arturoproal.com">
                                        Arturo Proal Walls ©
                                    </Link>
                                </Button>
                            </div>
                            <div className="mr-25">
                                <Button
                                    className="bg-transparent"
                                    variant="outline"
                                >
                                    <Link href="/">Buy me a cofee</Link>
                                </Button>
                            </div>
                            <div>
                                <Button
                                    className="bg-transparent"
                                    variant="ghost"
                                >
                                    <Link href="/">Legal</Link>
                                </Button>
                            </div>
                        </footer>
                    </ThemeProvider>
                </UserProvider>
            </body>
        </html>
    );
}
