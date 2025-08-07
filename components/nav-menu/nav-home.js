'use client';

import * as React from 'react';
import Link from 'next/link';
import { CircleCheckIcon, CircleHelpIcon, CircleIcon } from 'lucide-react';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    House,
    UserRound,
    Scale,
    NotebookPen,
    IdCard,
    LogIn,
} from 'lucide-react';
import { ModeToggle } from '@/components/ui/themes/mode-toggle';

export function NavigationMenuHome() {
    const [open, setOpen] = React.useState(false);

    return (
        <>
            {/* Desktop menu */}
            <nav className="hidden md:block">
                <NavigationMenu
                    position="popper"
                    viewport={false}
                    className="min-w-0 bg-transparent"
                >
                    <NavigationMenuList className="gap-4 bg-transparent">
                        <NavigationMenuItem className="bg-transparent">
                            <NavigationMenuLink
                                asChild
                                className="bg-transparent"
                            >
                                <Link href="/">Home</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger className="bg-transparent">
                                About
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[200px] gap-4">
                                    <li>
                                        <NavigationMenuLink asChild>
                                            <Link
                                                href="#"
                                                className="flex-row items-center gap-2"
                                            >
                                                <CircleHelpIcon />
                                                About
                                            </Link>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink asChild>
                                            <Link
                                                href="#"
                                                className="flex-row items-center gap-2"
                                            >
                                                <CircleIcon />
                                                Legal
                                            </Link>
                                        </NavigationMenuLink>
                                        <NavigationMenuLink asChild>
                                            <Link
                                                href="#"
                                                className="flex-row items-center gap-2"
                                            >
                                                <CircleCheckIcon />
                                                Terms & Conditions
                                            </Link>
                                        </NavigationMenuLink>
                                    </li>
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                asChild
                                className="bg-transparent"
                            >
                                <Link href="/sign-up">Sign Up</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                asChild
                                className="bg-transparent"
                            >
                                <Link href="/sign-in">Sign In</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem className="ml-4">
                            <ModeToggle />
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </nav>
            {/* Mobile menu */}
            <nav className="md:hidden">
                <Sheet
                    open={open}
                    onOpenChange={setOpen}
                    className="md:hidden flex flex-col"
                >
                    <SheetTrigger
                        className="cursor-pointer"
                        onClick={() => setOpen(true)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6 text-primary dark:text-foreground"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                    </SheetTrigger>
                    <SheetContent
                        side="top"
                        className="flex flex-col items-center justify-center min-h-screen w-full p-4 overflow-hidden"
                    >
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 -z-10 transform-gpu overflow-hidden blur-3xl"
                        >
                            <div
                                style={{
                                    clipPath:
                                        'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                                }}
                                className="absolute left-0 top-0 w-full h-full bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30"
                            />
                        </div>
                        <SheetHeader className="flex flex-col items-center justify-center w-full text-2xl">
                            <SheetTitle className="flex justify-center items-center w-full text-5xl text-primary dark:text-foreground mb-12">
                                AXIOM
                            </SheetTitle>
                            <nav className="flex flex-col gap-8 mt-4 items-center justify-center w-full">
                                <Button
                                    variant="link"
                                    size="lg"
                                    className=""
                                    onClick={() => setOpen(false)}
                                >
                                    <House className="mr-4 w-36 h-36 text-primary dark:text-foreground" />
                                    <Link
                                        href="/"
                                        className="w-full text-center text-[1.5625rem] font-light text-primary dark:text-foreground"
                                    >
                                        Home
                                    </Link>
                                </Button>
                                <Button
                                    variant="link"
                                    size="lg"
                                    className=""
                                    onClick={() => setOpen(false)}
                                >
                                    <UserRound className="mr-4 w-36 h-36 text-primary dark:text-foreground" />
                                    <Link
                                        href="#"
                                        className="w-full text-center text-2xl font-light text-primary dark:text-foreground"
                                    >
                                        About
                                    </Link>
                                </Button>
                                <Button
                                    variant="link"
                                    size="lg"
                                    className=""
                                    onClick={() => setOpen(false)}
                                >
                                    <Scale className="mr-4 w-36 h-36 text-primary dark:text-foreground" />
                                    <Link
                                        href="#"
                                        className="w-full text-center text-2xl font-light text-primary dark:text-foreground"
                                    >
                                        Legal
                                    </Link>
                                </Button>
                                <Button
                                    variant="link"
                                    size="lg"
                                    className=" "
                                    onClick={() => setOpen(false)}
                                >
                                    <NotebookPen className="mr-4 w-36 h-36 text-primary dark:text-foreground" />
                                    <Link
                                        href="#"
                                        className="w-full text-center text-2xl font-light text-primary dark:text-foreground"
                                    >
                                        Terms & Conditions
                                    </Link>
                                </Button>
                                <Button
                                    variant="link"
                                    size="lg"
                                    className=""
                                    onClick={() => setOpen(false)}
                                >
                                    <IdCard className="mr-4 w-36 h-36 text-primary dark:text-foreground" />
                                    <Link
                                        href="/sign-up"
                                        className="w-full text-center text-2xl font-light text-primary dark:text-foreground"
                                    >
                                        Sign Up
                                    </Link>
                                </Button>
                                <Button
                                    variant="link"
                                    size="lg"
                                    className=""
                                    onClick={() => setOpen(false)}
                                >
                                    <LogIn className="mr-4 w-36 h-36 text-primary dark:text-foreground" />
                                    <Link
                                        href="/sign-in"
                                        className="w-full text-center text-2xl font-light text-primary dark:text-foreground"
                                    >
                                        Sign In
                                    </Link>
                                </Button>
                                <ModeToggle />
                            </nav>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            </nav>
        </>
    );
}

function ListItem({ title, children, href, ...props }) {
    return (
        <li {...props}>
            <NavigationMenuLink asChild>
                <Link href={href}>
                    <div className="text-sm leading-none font-medium">
                        {title}
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-sm leading-snug">
                        {children}
                    </p>
                </Link>
            </NavigationMenuLink>
        </li>
    );
}
