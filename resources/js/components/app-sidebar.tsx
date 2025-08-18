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
  //Global
  { title: 'Header', href: '/admin/header', icon: LayoutPanelTop, group: 'Global'},
  { title: 'Footer', href: '/admin/footer', icon: LayoutPanelTop, group: 'Global'},
  { title: 'FAQs', href: '/admin/faqs', icon: HelpCircle, group: 'Global'},

  // Home Page
  { title: 'Hero', href: '/admin/hero', icon: Image, group: 'Home Page' },
  { title: 'Video', href: '/admin/video', icon: Video, group: 'Home Page' },
  { title: 'Sliders', href: '/admin/sliders', icon: Images, group: 'Home Page' },
  { title: 'Meeting', href: '/admin/meeting', icon: CalendarClock, group: 'Home Page' },
  { title: 'Form', href: '/admin/form-section', icon: FileText, group: 'Home Page' },

  // Pricing Page
  { title: 'Pricing Plans', href: '/admin/pricing-plans', icon: Tags, group: 'Pricing Page' },
  { title: 'Pricing Plans Features', href: '/admin/custom-features', icon: ListChecks, group: 'Pricing Page' },
  { title: 'Pricing Tables', href: '/admin/pricing-tables', icon: Table, group: 'Pricing Page' },

  // Newsletter
  { title: 'Articles', href: '/admin/articles', icon: FileTextIcon, group: 'Newsletter' },

  // T360
  { title: 'Our Mission', href: '/admin/mission', icon: Target, group: 'T360' },
  { title: 'President Showcase', href: '/admin/president-showcase', icon: Users, group: 'T360' },
  { title: 'Dashboard360', href: '/admin/dashboard360', icon: Gauge, group: 'T360' },
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
