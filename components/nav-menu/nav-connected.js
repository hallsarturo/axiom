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
import { ModeToggle } from '@/components/ui/themes/mode-toggle';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/lib/actions/actions';
import { useUser } from '@/components/context/UserProfileContext';

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
                                <NavigationMenuContent className="">
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
                <div className="md:hidden">
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
                                    Axiom
                                </SheetTitle>
                                <nav className="flex flex-col gap-4 mt-4 items-center justify-center w-full">
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        className="w-4/5 mx-auto flex justify-center items-center text-base"
                                    >
                                        <Link
                                            href="/profile"
                                            className="w-full text-center text-base"
                                        >
                                            Profile
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        className="w-4/5 mx-auto flex justify-center items-center text-base"
                                    >
                                        <Link
                                            href="/dashboard"
                                            className="w-full text-center text-base"
                                        >
                                            Dashboard
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        className="w-4/5 mx-auto flex justify-center items-center text-base"
                                    >
                                        <Link
                                            href="/saved-posts"
                                            className="w-full text-center text-base"
                                        >
                                            Saved Posts
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        className="w-4/5 mx-auto flex justify-center items-center text-base"
                                    >
                                        <Link
                                            href="/feed"
                                            className="w-full text-center text-base"
                                        >
                                            Feed Home
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="lg"
                                        className="w-4/5 mx-auto flex justify-center items-center text-base mb-4"
                                        onClick={handleLogout}
                                    >
                                        Sign Out
                                    </Button>
                                    <div className="w-4/5 mx-auto flex justify-center items-center">
                                        <ModeToggle />
                                    </div>
                                </nav>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                </div>
            </nav>
        </>
    );
}
