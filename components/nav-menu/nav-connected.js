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
import {
    Avatar as SCNAvatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar';
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
import {
    RssIcon,
    BookmarkIcon,
    CubeTransparentIcon,
    ClipboardDocumentListIcon,
    EnvelopeIcon,
} from '@heroicons/react/24/outline';
import { Badge } from '@/components/ui/badge';
import { ModeToggle } from '@/components/ui/themes/mode-toggle';
import { SearchBar } from '@/components/nav-menu/search-bar';
import { NotificationDropdown } from '@/components/notifications/notification-dropdown';
import { useRouter, usePathname } from 'next/navigation';
import { logoutUser } from '@/lib/actions/client-actions';
import { useUser } from '@/context/UserProfileContext';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { normalizeImageUrl } from '@/lib/utils/image';
import { genInitials } from '@/lib/utils/strings';

import { Avatar as TWAvatar } from '@/components/tailwind/avatar';
import {
    Dropdown,
    DropdownButton,
    DropdownDivider,
    DropdownItem,
    DropdownLabel,
    DropdownMenu,
} from '@/components/tailwind/dropdown';
import {
    Navbar,
    NavbarDivider,
    NavbarItem,
    NavbarLabel,
    NavbarSection,
    NavbarSpacer,
} from '@/components/tailwind/navbar';
import {
    ArrowRightStartOnRectangleIcon,
    ChevronDownIcon,
    Cog8ToothIcon,
    LightBulbIcon,
    PlusIcon,
    ShieldCheckIcon,
    UserIcon,
    BellIcon,
} from '@heroicons/react/16/solid';
import { InboxIcon, MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Combobox } from '@/components/tailwind/combobox';

function TailwindNavBar() {
    const { user } = useUser();
    return (
        <Navbar>
            <Dropdown>
                <DropdownButton as={NavbarItem}>
                    <TWAvatar src="/axiom_purple_X.png" />
                    <NavbarLabel>Axiom</NavbarLabel>
                    <ChevronDownIcon />
                </DropdownButton>
                <DropdownMenu className="min-w-64" anchor="bottom start">
                    <DropdownItem href="/teams/1/settings">
                        <Cog8ToothIcon />
                        <DropdownLabel>Settings</DropdownLabel>
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem href="/teams/1">
                        <TWAvatar slot="icon" src="/tailwind-logo.svg" />
                        <DropdownLabel>Tailwind Labs</DropdownLabel>
                    </DropdownItem>
                    <DropdownItem href="/teams/2">
                        <TWAvatar
                            slot="icon"
                            initials="WC"
                            className="bg-purple-500 text-white"
                        />
                        <DropdownLabel>Workcation</DropdownLabel>
                    </DropdownItem>
                    <DropdownDivider />
                    <DropdownItem href="/teams/create">
                        <PlusIcon />
                        <DropdownLabel>New team&hellip;</DropdownLabel>
                    </DropdownItem>
                </DropdownMenu>
            </Dropdown>
            <NavbarDivider className="max-lg:hidden" />
            <NavbarSection className="max-lg:hidden">
                <NavbarItem href="/" current>
                    Home
                </NavbarItem>
                <NavbarItem href="/events">Events</NavbarItem>
                <NavbarItem href="/orders">Orders</NavbarItem>
            </NavbarSection>
            <NavbarSpacer />
            <NavbarSection>
                <NavbarItem href="/search" aria-label="Search">
                    <MagnifyingGlassIcon />
                </NavbarItem>
                <NavbarItem href="/inbox" aria-label="Inbox">
                    <BellIcon />
                </NavbarItem>
                <Dropdown>
                    <DropdownButton as={NavbarItem}>
                        <TWAvatar src="/profile-photo.jpg" square />
                    </DropdownButton>
                    <DropdownMenu className="min-w-64" anchor="bottom end">
                        <DropdownItem href="/my-profile">
                            <UserIcon />
                            <DropdownLabel>My profile</DropdownLabel>
                        </DropdownItem>
                        <DropdownItem href="/settings">
                            <Cog8ToothIcon />
                            <DropdownLabel>Settings</DropdownLabel>
                        </DropdownItem>
                        <DropdownDivider />
                        <DropdownItem href="/privacy-policy">
                            <ShieldCheckIcon />
                            <DropdownLabel>Privacy policy</DropdownLabel>
                        </DropdownItem>
                        <DropdownItem href="/share-feedback">
                            <LightBulbIcon />
                            <DropdownLabel>Share feedback</DropdownLabel>
                        </DropdownItem>
                        <DropdownDivider />
                        <DropdownItem href="/logout">
                            <ArrowRightStartOnRectangleIcon />
                            <DropdownLabel>Sign out</DropdownLabel>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarSection>
        </Navbar>
    );
}

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

const navigation = [
    {
        name: 'Feed',
        href: '/feed',
        icon: RssIcon,
        current: true,
        newTab: false,
    },
    {
        name: 'Echo meter',
        href: '/echo-meter',
        icon: CubeTransparentIcon,
        current: false,
        newTab: false,
    },
    {
        name: 'Bookmarks',
        href: '/saved-posts',
        icon: BookmarkIcon,
        current: false,
        newTab: false,
    },
    {
        name: 'Contrast',
        href: '#',
        icon: ClipboardDocumentListIcon,
        current: false,
        newTab: false,
    },
    {
        name: 'Contact',
        href: 'https://arturoproal.com/contact',
        icon: EnvelopeIcon,
        current: false,
        newTab: true,
    },
];

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}
export function NavigationConnected() {
    const router = useRouter();
    const { user } = useUser();
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const requireAuth = useRequireAuth();

    const dynamicNavigation = navigation.map((item) => ({
        ...item,
        current: pathname === item.href,
    }));

    const handleLogout = async () => {
        const result = await logoutUser();
        if (result.success) {
            // Clear localStorage token (for development)
            if (typeof window !== 'undefined') {
                localStorage.removeItem('token');
            }

            // Force page reload to clear any cached state
            window.location.href = '/sign-in';
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
                                    <SCNAvatar className="hover: text-white">
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
                                    </SCNAvatar>
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

            {/* Mobile menu */}
            <div className="md:hidden flex w-full items-center mx-2 justify-around">
                <TailwindNavBar />
                {/* HABMBURGER MENU */}
                {/* <nav className="md:hidden">
                    <Sheet
                        open={open}
                        onOpenChange={setOpen}
                        className="md:hidden flex flex-col "
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
                            className="flex flex-col items-center min-h-screen w-full overflow-hidden"
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
                            <SheetHeader className="flex flex-col items-center min-h-screen w-full text-2xl p-15">
                                <SheetTitle className="flex justify-center items-center w-full text-5xl text-primary dark:text-foreground mb-0">
                                    <Link
                                        href="/"
                                        onClick={() => setOpen(false)}
                                    >
                                        <Image
                                            src="/axiom_purple.png"
                                            height={100}
                                            width={150}
                                            alt="Axiom logo"
                                        />
                                    </Link>
                                </SheetTitle>
                                <nav
                                    aria-label="Sidebar"
                                    className="flex flex-1 flex-col m-4 h-full"
                                >
                                    <ul role="list" className="space-y-4">
                                        {dynamicNavigation.map((item) => (
                                            <li key={item.name}>
                                                <a
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? 'bg-transparent text-primary font-bold dark:bg-white/5 dark:text-white'
                                                            : 'text-secondary-foreground hover:bg-red-100 hover:text-primary dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                                                    )}
                                                >
                                                    <item.icon
                                                        aria-hidden="true"
                                                        className={classNames(
                                                            item.current
                                                                ? 'text-primary dark:text-white'
                                                                : 'text-secondary-foreground group-hover:text-primary dark:text-primary-foreground dark:group-hover:text-white',
                                                            'size-6 shrink-0'
                                                        )}
                                                    />
                                                    {item.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </nav>
                                <div className="pb-5">
                                    <ModeToggle />
                                </div>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                </nav> */}
            </div>
        </>
    );
}
