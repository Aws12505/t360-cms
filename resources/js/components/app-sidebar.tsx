import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid } from 'lucide-react';
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Header',
        href: '/admin/header',
        icon: LayoutGrid,
    },
    {
        title: 'Footer',
        href: '/admin/footer',
        icon: LayoutGrid,
    },
    {
        title: 'Hero',
        href: '/admin/hero',
        icon: LayoutGrid,
    },
    {
        title: 'Video',
        href: '/admin/video',
        icon: LayoutGrid,
    },
    {
        title: 'Sliders',
        href: '/admin/sliders',
        icon: LayoutGrid,
    },
    {
        title: 'Faqs',
        href: '/admin/faqs',
        icon: LayoutGrid,
    },
    {
        title: 'Meeting',
        href: '/admin/meeting',
        icon: LayoutGrid,
    },
    {
        title: 'Form',
        href: '/admin/form-section',
        icon: LayoutGrid,
    },
    {
        title: 'Pricing Plans',
        href: '/admin/pricing-plans',
        icon: LayoutGrid,
    },
    {
        title: 'Pricing Plans Features',
        href: '/admin/custom-features',
        icon: LayoutGrid,
    },
    {
        title: 'Pricing Tables',
        href: '/admin/pricing-tables',
        icon: LayoutGrid,
    },
    {
        title: 'Articles',
        href: '/admin/articles',
        icon: LayoutGrid,
    }
];

const footerNavItems: NavItem[] = [
    // {
    //     title: 'Repository',
    //     href: 'https://github.com/laravel/react-starter-kit',
    //     icon: Folder,
    // },
    // {
    //     title: 'Documentation',
    //     href: 'https://laravel.com/docs/starter-kits#react',
    //     icon: BookOpen,
    // },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin/header" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
