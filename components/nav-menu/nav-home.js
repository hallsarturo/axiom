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

export function NavigationMenuHome() {
    return (
        <>
            {/* Desktop menu */}
            <nav className="hidden md:block">
                <NavigationMenu
                    position="popper"
                    viewport={false}
                    className="min-w-0"
                >
                    <NavigationMenuList className="gap-4">
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                asChild
                                className={navigationMenuTriggerStyle()}
                            >
                                <Link href="/">Home</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuTrigger>About</NavigationMenuTrigger>
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
                                className={navigationMenuTriggerStyle()}
                            >
                                <Link href="/sign-up">Sign Up</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                        <NavigationMenuItem>
                            <NavigationMenuLink
                                asChild
                                className={navigationMenuTriggerStyle()}
                            >
                                <Link href="/sign-in">Sign In</Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    </NavigationMenuList>
                </NavigationMenu>
            </nav>
            {/* Mobile menu */}
            <nav className="md:hidden">
                <Sheet className="md:hidden flex flex-col">
                    <SheetTrigger className="cursor-pointer">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="size-6"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                            />
                        </svg>
                    </SheetTrigger>
                    <SheetContent
                        side="left"
                        className="flex flex-col items-center justify-center min-h-screen p-4"
                    >
                        <SheetHeader className="flex flex-col items-center justify-center w-full">
                            <SheetTitle className="flex justify-center items-center w-full mb-4">
                                Home Menu
                            </SheetTitle>
                            <nav className="flex flex-col gap-4 mt-4 items-center justify-center w-full">
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="w-4/5 mx-auto flex justify-center items-center text-base"
                                >
                                    <Link
                                        href="/"
                                        className="w-full text-center text-base"
                                    >
                                        Home
                                    </Link>
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="w-4/5 mx-auto flex justify-center items-center text-base"
                                >
                                    <Link
                                        href="#"
                                        className="w-full text-center text-base"
                                    >
                                        About
                                    </Link>
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="w-4/5 mx-auto flex justify-center items-center text-base"
                                >
                                    <Link
                                        href="#"
                                        className="w-full text-center text-base"
                                    >
                                        Legal
                                    </Link>
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="w-4/5 mx-auto flex justify-center items-center text-base"
                                >
                                    <Link
                                        href="#"
                                        className="w-full text-center text-base"
                                    >
                                        Terms & Conditions
                                    </Link>
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="w-4/5 mx-auto flex justify-center items-center text-base"
                                >
                                    <Link
                                        href="/sign-up"
                                        className="w-full text-center text-base"
                                    >
                                        Sign Up
                                    </Link>
                                </Button>
                                <Button
                                    variant="secondary"
                                    size="lg"
                                    className="w-4/5 mx-auto flex justify-center items-center text-base mb-4"
                                >
                                    <Link
                                        href="/sign-in"
                                        className="w-full text-center text-base"
                                    >
                                        Sign In
                                    </Link>
                                </Button>
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
