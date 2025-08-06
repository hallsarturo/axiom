'use client';

import Link from 'next/link';
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import { MobileMenu } from '@/components/nav-menu/mobile-menu';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/actions/actions';
import { useUser } from '@/components/context/UserProfileContext';
import { useState } from 'react';

export function NavigationConnected() {
    const router = useRouter();
    const { user } = useUser();

    const handleLogout = async () => {
        const result = await logoutUser();
        if (result.success) {
            localStorage.removeItem('token');
            router.push('/sign-in');
        }
    };

    return (
        <>
            <nav className="">
                {/* Desktop menu */}
                <div className="hidden md:block">
                    <NavigationMenu viewport={false}>
                        <NavigationMenuList className="gap-4">
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                    className={navigationMenuTriggerStyle()}
                                >
                                    <Link href="/profile">Profile</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                    className={navigationMenuTriggerStyle()}
                                >
                                    <Link href="/dashboard">Dashboard</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                    className={navigationMenuTriggerStyle()}
                                >
                                    <Link href="/saved-posts">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="size-6"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuLink
                                    asChild
                                    className={navigationMenuTriggerStyle()}
                                >
                                    <Link href="/feed">Feed Home</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                            <NavigationMenuItem>
                                <NavigationMenuTrigger>
                                    <Avatar>
                                        <AvatarImage
                                            src={user ? user.photoUrl : null}
                                        />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <NavigationMenuLink
                                        asChild
                                        className="flex flex-col justify-center items-center w-[150px]"
                                    >
                                        <Button
                                            variant="link"
                                            className="w-32 mx-auto"
                                            onClick={handleLogout}
                                        >
                                            Sign Out
                                        </Button>
                                    </NavigationMenuLink>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </nav>
            <nav>
                {/* Mobile full-screen menu */}
                <div className="md:hidden">
                    <Sheet className="md:hidden">
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
                        <SheetContent side="top">
                            <SheetHeader>
                                <SheetTitle>
                                    Are you absolutely sure?
                                </SheetTitle>
                                <SheetDescription>
                                    This action cannot be undone. This will
                                    permanently delete your account and remove
                                    your data from our servers.
                                </SheetDescription>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </>
    );
}
