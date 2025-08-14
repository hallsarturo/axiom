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
} from 'lucide-react';

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
import { usePathname } from 'next/navigation';

// Menu items.
const mainMenuItems = [
    {
        title: 'Feed',
        url: '/feed',
        icon: Rss,
    },
    {
        title: 'Profile',
        url: '/profile',
        icon: UserRoundPen,
    },
    {
        title: 'Followers',
        url: '#',
        icon: UserRoundCheck,
    },
    {
        title: 'Following',
        url: '#',
        icon: Users,
    },
    {
        title: 'Settings',
        url: '/dashboard',
        icon: Settings,
    },
];

// Feed options
const feedOptions = [
    {
        title: 'PostType',
        icon: Newspaper,
    },
];

export function AppSidebar() {
    const pathname = usePathname();
    return (
        <Sidebar>
            <SidebarContent className="bg-white dark:bg-background">
                <SidebarGroup>
                    <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {mainMenuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        size=""
                                        variant=""
                                    >
                                        <a
                                            href={item.url}
                                            className="text-primary dark:text-foreground"
                                        >
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
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
