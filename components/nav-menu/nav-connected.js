'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
import {
    Home,
    UserRound,
    Scale,
    NotebookPen,
    IdCard,
    LogIn,
    LogOut,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ModeToggle } from '@/components/ui/themes/mode-toggle';
import { SearchBar } from '@/components/nav-menu/search-bar';
import { NotificationDropdown } from '@/components/notifications/notification-dropdown';
import { useRouter, usePathname } from 'next/navigation';
import { logoutUser } from '@/lib/actions/actions';
import { useUser } from '@/components/context/UserProfileContext';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { normalizeImageUrl } from '@/lib/utils/image';
import { genInitials } from '@/lib/utils/strings';

const mobileMenuItems = [
    {
        label: 'Feed',
        href: '/feed',
        icon: (
            <NotebookPen className="mr-4 w-36 h-36 text-primary dark:text-foreground" />
        ),
    },
    {
        label: 'Profile',
        href: '/profile',
        icon: (
            <Home className="mr-4 w-36 h-36 text-primary dark:text-foreground" />
        ),
    },
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: (
            <UserRound className="mr-4 w-36 h-36 text-primary dark:text-foreground" />
        ),
    },
    {
        label: 'Saved Posts',
        href: '/saved-posts',
        icon: (
            <Scale className="mr-4 w-36 h-36 text-primary dark:text-foreground" />
        ),
    },
];

export function NavigationConnected() {
    const router = useRouter();
    const { user } = useUser();
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const requireAuth = useRequireAuth();

    const handleLogout = async () => {
        const result = await logoutUser();
        if (result.success) {
            localStorage.removeItem('token');
            router.push('/sign-in');
        }
    };

    const menuItems = [
        {
            label: 'Feed',
            href: '/feed',
            icon: Home,
            button: true,
            requiresAuth: false,
        },
        {
            label: 'Echo meter',
            href: '/echo-meter',
            icon: null,
            button: true,
            requiresAuth: false,
        },
        {
            label: 'Saved Posts',
            href: user?.id ? `/saved-posts/${user.id}` : '#',
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-4 text-primary dark:text-foreground hover:text-white transition-colors"
                >
                    <path
                        fillRule="evenodd"
                        d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
            button: false,
            requiresAuth: true,
        },
        {
            label: 'Contrast',
            href: '#',
            icon: null,
            button: true,
            requiresAuth: false,
        },
    ];

    return (
        <>
            {/* Desktop menu */}
            <div className="hidden md:flex md:w-full md:justify-around">
                {/* Left section - Search */}
                <div className="flex justify-center">
                    <NavigationMenu
                        position="popper"
                        viewport={false}
                        className="flex w-full !max-w-full"
                    >
                        <NavigationMenuList>
                            <div className="flex items-center justify-around">
                                <NavigationMenuItem className="mr-10">
                                    <Link href="/feed">
                                        <Image
                                            src="/axiom_purple.png"
                                            width={60}
                                            height={40}
                                            alt="Axiom logo"
                                        />
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <SearchBar />
                                </NavigationMenuItem>
                            </div>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Center section - Main menu items */}
                <div className="flex justify-center">
                    <NavigationMenu
                        position="popper"
                        viewport={false}
                        className="flex w-full !max-w-full"
                    >
                        <NavigationMenuList className="flex w-full">
                            <div className="flex w-full justify-center gap-6">
                                {menuItems.map((item, idx) => {
                                    const isActive = pathname === item.href;
                                    return (
                                        <NavigationMenuItem key={idx}>
                                            <NavigationMenuLink
                                                asChild
                                                className={
                                                    `${navigationMenuTriggerStyle()} font-medium ` +
                                                    (isActive
                                                        ? 'bg-accent text-accent-foreground dark:bg-accent dark:text-accent-foreground'
                                                        : 'text-primary dark:text-foreground')
                                                }
                                            >
                                                {item.button ? (
                                                    <Button
                                                        variant={
                                                            isActive
                                                                ? 'accent'
                                                                : 'primary'
                                                        }
                                                        asChild
                                                        onClick={(e) => {
                                                            if (
                                                                item.requiresAuth &&
                                                                !user?.id
                                                            ) {
                                                                e.preventDefault();
                                                                requireAuth();
                                                            }
                                                        }}
                                                    >
                                                        <Link href={item.href}>
                                                            {item.label}
                                                        </Link>
                                                    </Button>
                                                ) : (
                                                    <Link href={item.href}>
                                                        {item.icon}
                                                    </Link>
                                                )}
                                            </NavigationMenuLink>
                                        </NavigationMenuItem>
                                    );
                                })}
                            </div>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>

                {/* Right section - User controls */}
                <div className="flex justify-center">
                    <NavigationMenu
                        position="popper"
                        viewport={false}
                        className="flex w-full !max-w-full"
                    >
                        <NavigationMenuList>
                            <NavigationMenuItem className="flex cursor-pointer">
                                <NotificationDropdown userId={user?.id} />
                            </NavigationMenuItem>

                            <NavigationMenuItem>
                                {/* Avatar and dropdown menu */}
                                <NavigationMenuTrigger className="text-primary font-medium dark:text-foreground cursor-pointer">
                                    <Avatar className="hover: text-white">
                                        <AvatarImage
                                            src={
                                                user
                                                    ? normalizeImageUrl(
                                                          user.userProfilePic
                                                      ) ||
                                                      normalizeImageUrl(
                                                          user.photoUrl
                                                      )
                                                    : '/user_silhouette_2.png'
                                            }
                                        />
                                        <AvatarFallback>
                                            {user ? (
                                                genInitials(user?.username)
                                            ) : (
                                                <AvatarImage src="/user_silhouette_2.png"></AvatarImage>
                                            )}
                                        </AvatarFallback>
                                    </Avatar>
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    {user && (
                                        <NavigationMenuLink className="cursor-default text-center">
                                            <p>
                                                {' '}
                                                logged as:{' '}
                                                <span className="font-bold">
                                                    {user
                                                        ? user?.displayName ||
                                                          user?.username
                                                        : null}
                                                </span>
                                            </p>
                                        </NavigationMenuLink>
                                    )}
                                    <NavigationMenuLink
                                        asChild
                                        className="flex flex-col justify-center items-center w-[150px]"
                                    >
                                        {user ? (
                                            <Button
                                                asChild
                                                variant="link"
                                                className="w-32 mx-auto flex gap-4 items-center"
                                                onClick={handleLogout}
                                            >
                                                <div className="flex flex-row items-center gap-4">
                                                    <LogOut className="text-primary  dark:text-foreground" />
                                                    Sign Out
                                                </div>
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="link"
                                                className="w-32 mx-auto"
                                                asChild
                                            >
                                                <Link
                                                    href="/sign-in"
                                                    className="flex gap-4 items-center"
                                                >
                                                    <div className="flex flex-row items-center gap-4">
                                                        <LogIn className="text-primary  dark:text-foreground  " />
                                                        Sign In
                                                    </div>
                                                </Link>
                                            </Button>
                                        )}
                                    </NavigationMenuLink>
                                </NavigationMenuContent>
                            </NavigationMenuItem>

                            <NavigationMenuItem className="flex">
                                <NavigationMenuLink
                                    asChild
                                    className={navigationMenuTriggerStyle()}
                                >
                                    <ModeToggle />
                                </NavigationMenuLink>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>

            {/* Mobile full-screen menu */}
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
                                {mobileMenuItems.map((item, idx) => (
                                    <Button
                                        key={idx}
                                        variant="link"
                                        size="lg"
                                        className=""
                                        onClick={() => setOpen(false)}
                                    >
                                        {item.icon}
                                        <Link
                                            href={item.href}
                                            className="w-full text-center text-2xl font-light text-primary dark:text-foreground"
                                        >
                                            {item.label}
                                        </Link>
                                    </Button>
                                ))}
                                <Button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleLogout();
                                    }}
                                    variant="link"
                                    size="lg"
                                    className="text-2xl font-light text-primary dark:text-foreground"
                                >
                                    <IdCard className="mr-4 w-36 h-36 text-primary dark:text-foreground" />
                                    Sign Out
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
