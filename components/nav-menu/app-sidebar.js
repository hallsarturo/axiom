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
import { useUser } from '@/components/context/UserProfileContext';
import { usePathname } from 'next/navigation';

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
            url: user ? `/my-posts/${user.id}` : '/my-posts',
            icon: Library,
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
