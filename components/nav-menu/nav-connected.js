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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/actions/actions';
import { useUser } from '@/components/context/UserProfileContext';

const components = [
    {
        title: 'Alert Dialog',
        href: '/docs/primitives/alert-dialog',
        description:
            'A modal dialog that interrupts the user with important content and expects a response.',
    },
    {
        title: 'Hover Card',
        href: '/docs/primitives/hover-card',
        description:
            'For sighted users to preview content available behind a link.',
    },
    {
        title: 'Progress',
        href: '/docs/primitives/progress',
        description:
            'Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.',
    },
    {
        title: 'Scroll-area',
        href: '/docs/primitives/scroll-area',
        description: 'Visually or semantically separates content.',
    },
    {
        title: 'Tabs',
        href: '/docs/primitives/tabs',
        description:
            'A set of layered sections of content—known as tab panels—that are displayed one at a time.',
    },
    {
        title: 'Tooltip',
        href: '/docs/primitives/tooltip',
        description:
            'A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.',
    },
];

export function NavigationConnected() {
    const router = useRouter();
    const handleLogout = async () => {
        const result = await logoutUser();
        if (result.success) {
            localStorage.removeItem('token');
            router.push('/sign-in');
        }
    };

    const { user } = useUser();
    return (
        <NavigationMenu viewport={false}>
            <NavigationMenuList className="gap-4">
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
