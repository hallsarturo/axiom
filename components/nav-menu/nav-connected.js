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
import { useRouter, usePathname } from 'next/navigation';
import { logoutUser } from '@/lib/actions/actions';
import { useUser } from '@/components/context/UserProfileContext';
import { useState } from 'react';
import { useParams } from 'next/navigation';

const menuItems = [
    {
        label: 'Feed',
        href: '/feed',
        icon: Home,
        button: true,
    },
    {
        label: 'Echo meter',
        href: '/echo-meter',
        icon: null,
        button: true,
    },
    {
        label: 'Saved Posts',
        href: '/saved-posts',
        icon: (
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-4 text-primary dark:text-foreground"
            >
                <path
                    fillRule="evenodd"
                    d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z"
                    clipRule="evenodd"
                />
            </svg>
        ),
        button: false,
    },
    {
        label: 'Contrast',
        href: '#',
        icon: null,
        button: true,
    },
];

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
                    <NavigationMenu
                        position="popper"
                        viewport={false}
                        className="min-w-0"
                    >
                        <NavigationMenuList className="gap-4">
                            <NavigationMenuItem>
                                <SearchBar />
                            </NavigationMenuItem>
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
                            <div className="flex justify-end ml-7">
                                <NavigationMenuItem>
                                    <NavigationMenuTrigger className="text-primary dark:text-foreground">
                                        <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums cursor-pointer">
                                            8
                                        </Badge>
                                    </NavigationMenuTrigger>
                                </NavigationMenuItem>
                                <NavigationMenuItem className="">
                                    <NavigationMenuTrigger className="text-primary font-medium dark:text-foreground cursor-pointer">
                                        <Avatar>
                                            <AvatarImage
                                                src={
                                                    user ? user.photoUrl : null
                                                }
                                            />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </NavigationMenuTrigger>
                                    <NavigationMenuContent className="">
                                        <NavigationMenuLink className="cursor-default text-center">
                                            <p>
                                                {user
                                                    ? user?.displayName
                                                    : null}
                                            </p>
                                        </NavigationMenuLink>
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
                            </div>
                            <NavigationMenuItem>
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
            </nav>
            <nav>
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
            </nav>
        </>
    );
}
