import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
  const page = usePage();

  // Group items by their `group`
  const groupedItems = items.reduce((groups: Record<string, NavItem[]>, item) => {
    const group = item.group ?? 'Other';
    if (!groups[group]) groups[group] = [];
    groups[group].push(item);
    return groups;
  }, {});

  return (
    <>
      {Object.entries(groupedItems).map(([group, groupItems]) => (
        <SidebarGroup key={group} className="px-2 py-0">
          <SidebarGroupLabel>{group}</SidebarGroupLabel>
          <SidebarMenu>
            {groupItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={page.url.startsWith(item.href)}
                  tooltip={{ children: item.title }}
                >
                  <Link href={item.href} prefetch>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
