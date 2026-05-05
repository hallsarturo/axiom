'use client';

import {
    Calendar,
    Rss,
    Home,
    UserRoundCheck,
    Users,
    UserRoundPen,
    Inbox,
    Search,
    Settings,
    Newspaper,
    Library,
    Bookmark,
} from 'lucide-react';

import {
    RssIcon,
    BookmarkIcon,
    Cog6ToothIcon,
    BookOpenIcon,
    UserIcon,
    UserGroupIcon,
    UserPlusIcon,
} from '@heroicons/react/24/outline';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { SelectPostType } from '@/components/feed/select-post-type';
import { useUser } from '@/context/UserProfileContext';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export function AppSidebar() {
    const { user } = useUser();
    const pathname = usePathname();

    const mainMenuItems = [
        {
            title: 'Feed',
            url: '/feed',
            icon: Rss,
        },
        {
            title: 'Profile',
            url: user ? `/profile/${user.id}` : '/profile',
            icon: UserRoundPen,
        },
        {
            title: 'My Posts',
            url: user ? `/my-posts/${user.id}` : '/#',
            icon: Library,
        },
        {
            title: 'Saved Posts',
            url: user ? `/saved-posts/${user.id}` : '/#',
            icon: Bookmark,
        },
        {
            title: 'Followers',
            url: user ? `/followers/${user.id}` : '#',
            icon: UserRoundCheck,
        },
        {
            title: 'Following',
            url: user ? `/following/${user.id}` : '#',
            icon: Users,
        },
        {
            title: 'Settings',
            url: '/dashboard',
            icon: Settings,
        },
    ];

    const navigation = [
        { name: 'Feed', href: '/feed', icon: RssIcon, current: true },
        {
            name: 'Profile',
            href: user ? `/profile/${user.id}` : '/profile',
            icon: UserIcon,
            current: false,
        },
        {
            name: 'My Posts',
            href: user ? `/my-posts/${user.id}` : '/#',
            icon: BookOpenIcon,
            current: false,
        },
        { name: 'Saved Posts', href: '#', icon: BookmarkIcon, current: false },
        {
            name: 'Followers',
            href: user ? `/followers/${user.id}` : '#',
            icon: UserGroupIcon,
            current: false,
        },
        {
            name: 'Following',
            href: user ? `/following/${user.id}` : '#',
            icon: UserPlusIcon,
            current: false,
        },
        {
            name: 'Settings',
            href: '/dashboard',
            icon: Cog6ToothIcon,
            current: false,
        },
    ];

    function classNames(...classes) {
        return classes.filter(Boolean).join(' ');
    }

    return (
        <Sidebar className="md:z-25 ">
            <SidebarContent className="relative flex grow flex-col gap-y-5 overflow-y-auto bg-background px-6 pb-2 dark:bg-background dark:ring dark:ring-white/10 dark:before:pointer-events-none dark:before:absolute dark:before:inset-0 dark:before:bg-black/10">
                <div className="relative flex h-16 shrink-0 items-center">
                    <Image
                        src="/axiom_purple.png"
                        width={60}
                        height={40}
                        alt="Axiom logo"
                        className="h-8 w-auto dark:hidden"
                    />
                    <Image
                        src="/axiom_white.png"
                        width={60}
                        height={40}
                        alt="Axiom logo"
                        className="h-8 w-auto not-dark:hidden"
                    />
                </div>
                <SidebarGroup>
                    <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <nav className="relative flex flex-1 flex-col">
                            <ul
                                role="list"
                                className="flex flex-1 flex-col gap-y-7"
                            >
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {navigation.map((item) => (
                                            <li key={item.name}>
                                                <Link
                                                    href={item.href}
                                                    className={classNames(
                                                        item.current
                                                            ? 'bg-gray-50 text-primary dark:bg-background dark:text-primary-foreground'
                                                            : 'text-foreground hover:bg-gray-50 hover:text-primary dark:text-secondary-foreground dark:hover:bg-white/5 dark:hover:text-primary-foreground',
                                                        'group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold'
                                                    )}
                                                >
                                                    <item.icon
                                                        aria-hidden="true"
                                                        className={classNames(
                                                            item.current
                                                                ? 'text-primary dark:text-white'
                                                                : 'text-gray-400 group-hover:text-primary dark:group-hover:text-primary-foreground',
                                                            'size-6 shrink-0'
                                                        )}
                                                    />
                                                    {item.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            </ul>
                        </nav>
                    </SidebarGroupContent>
                </SidebarGroup>
                {pathname === '/feed' ? (
                    <SidebarGroup>
                        <SidebarGroupLabel>Feed Options</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SelectPostType />
                        </SidebarGroupContent>
                    </SidebarGroup>
                ) : null}
            </SidebarContent>
        </Sidebar>
    );
}
