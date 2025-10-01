'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronRight, CircleIcon } from 'lucide-react';
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
import {
  
    IdentificationIcon,
    ArrowDownOnSquareIcon,
    InformationCircleIcon,
    HomeIcon,
    EnvelopeIcon,
    BriefcaseIcon,
    BuildingLibraryIcon,
    ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/outline';
import { ModeToggle } from '@/components/ui/themes/mode-toggle';

const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon, current: true },
    {
        name: 'Login',
        href: '/sign-in',
        icon: ArrowDownOnSquareIcon,
        current: false,
        newTab: false,
    },
    {
        name: 'Signup',
        href: '/sign-up',
        icon: IdentificationIcon,
        current: false,
        newTab: false,
    },
    {
        name: 'About',
        href: '/about',
        icon: InformationCircleIcon,
        current: false,
        newTab: false,
    },
    {
        name: 'Terms & Conditions',
        href: '/terms-and-conditions',
        icon: ClipboardDocumentCheckIcon,
        current: false,
        newTab: false,
    },
    {
        name: 'Legal Notice',
        href: '/legal-notice',
        icon: BuildingLibraryIcon,
        current: false,
        newTab: false,
    },
    {
        name: 'Privacy Policy',
        href: '/privacy-policy',
        icon: BriefcaseIcon,
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

export function NavigationMenuHome() {
    const [open, setOpen] = React.useState(false);
    const pathname = usePathname();

    const dynamicNavigation = navigation.map((item) => ({
        ...item,
        current: pathname === item.href,
    }));

    const menuItems = [
        { href: '/sign-up', label: 'Sign Up' },
        { href: '/sign-in', label: 'Sign In' },
    ];

    return (
        <>
            {/* Desktop menu */}
            <div className="hidden md:flex w-full justify-center items-center">
                <div className="flex w-2/2 justify-end">
                    <NavigationMenu
                        position="popper"
                        viewport={false}
                        className="min-w-0 bg-transparent"
                    >
                        <NavigationMenuList className="gap-14 bg-transparent">
                            <NavigationMenuItem className="">
                                <Link href="/">
                                    <Image
                                        src="/axiom_purple.png"
                                        width={60}
                                        height={40}
                                        alt="Axiom logo"
                                    />
                                </Link>
                            </NavigationMenuItem>
                            {menuItems.map((item, idx) => {
                                const isActive = pathname === item.href;
                                return (
                                    <NavigationMenuItem
                                        key={idx}
                                        className="bg-transparent"
                                    >
                                        <NavigationMenuLink
                                            asChild
                                            className={
                                                `bg-transparent font-medium ` +
                                                (isActive
                                                    ? 'text-primary dark:text-accent-foreground'
                                                    : '')
                                            }
                                        >
                                            <Link href={item.href}>
                                                {item.label}
                                            </Link>
                                        </NavigationMenuLink>
                                    </NavigationMenuItem>
                                );
                            })}
                            <NavigationMenuItem>
                                <NavigationMenuTrigger className="bg-transparent">
                                    About
                                </NavigationMenuTrigger>
                                <NavigationMenuContent>
                                    <ul className="grid w-[200px] gap-4">
                                        <li>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href="/about"
                                                    className="flex-row items-center gap-2"
                                                >
                                                    <ChevronRight />
                                                    About
                                                </Link>
                                            </NavigationMenuLink>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href="/privacy-policy"
                                                    className="flex-row items-center gap-2"
                                                >
                                                    <ChevronRight />
                                                    Privacy Policy
                                                </Link>
                                            </NavigationMenuLink>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href="terms-and-conditions"
                                                    className="flex-row items-center gap-2"
                                                >
                                                    <ChevronRight />
                                                    Terms & Conditions
                                                </Link>
                                            </NavigationMenuLink>
                                            <NavigationMenuLink asChild>
                                                <Link
                                                    href="/legal-notice"
                                                    className="flex-row items-center gap-2"
                                                >
                                                    <ChevronRight />
                                                    Legal notice
                                                </Link>
                                            </NavigationMenuLink>
                                        </li>
                                    </ul>
                                </NavigationMenuContent>
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <div className="flex w-1/2 justify-end mr-4">
                    <NavigationMenu
                        position="popper"
                        viewport={false}
                        className="min-w-0 bg-transparent"
                    >
                        <NavigationMenuList className="gap-4 bg-transparent">
                            <NavigationMenuItem className="ml-4">
                                <ModeToggle />
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
            </div>
            {/* Mobile menu */}
            <nav className="md:hidden">
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
                                <Link href="/" onClick={() => setOpen(false)}>
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
