import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import {
  LayoutPanelTop,   // for Header
  Image,             // for Hero
  Video,             // for Video
  Images,            // for Sliders
  HelpCircle,        // for Faqs
  CalendarClock,     // for Meeting
  FileText,          // for Form Section
  Tags,              // for Pricing Plans
  ListChecks,        // for Pricing Plans Features
  Table,             // for Pricing Tables
  FileTextIcon,      // for Articles
  Target,            // for Our Mission
  Users,             // for President Showcase
  Gauge,             // for Dashboard360
} from "lucide-react";
import AppLogo from './app-logo';

const mainNavItems: NavItem[] = [
    {
        title: 'Header',
        href: '/admin/header',
        icon: LayoutPanelTop,
    },
    {
        title: 'Footer',
        href: '/admin/footer',
        icon: LayoutPanelTop,
    },
    {
        title: 'Hero',
        href: '/admin/hero',
        icon: Image,
    },
    {
        title: 'Video',
        href: '/admin/video',
        icon: Video,
    },
    {
        title: 'Sliders',
        href: '/admin/sliders',
        icon: Images,
    },
    {
        title: 'Faqs',
        href: '/admin/faqs',
        icon: HelpCircle,
    },
    {
        title: 'Meeting',
        href: '/admin/meeting',
        icon: CalendarClock,
    },
    {
        title: 'Form',
        href: '/admin/form-section',
        icon: FileText,
    },
    {
        title: 'Pricing Plans',
        href: '/admin/pricing-plans',
        icon: Tags,
    },
    {
        title: 'Pricing Plans Features',
        href: '/admin/custom-features',
        icon: ListChecks,
    },
    {
        title: 'Pricing Tables',
        href: '/admin/pricing-tables',
        icon: Table,
    },
    {
        title: 'Articles',
        href: '/admin/articles',
        icon: FileTextIcon,
    },
    {
        title: 'Our Mission',
        href: '/admin/mission',
        icon: Target,
    },
    {
        title: 'President Showcase',
        href: '/admin/president-showcase',
        icon: Users,
    },
    {
        title: 'Dashboard360',
        href: '/admin/dashboard360',
        icon: Gauge,
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
