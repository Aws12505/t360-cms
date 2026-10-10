import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

const badgeCount = (props: Record<string, unknown>, key?: string): number => {
  if (!key) return 0;
  const value = key.split('.').reduce<unknown>((obj, part) => (obj as Record<string, unknown> | null | undefined)?.[part], props);
  return typeof value === 'number' ? value : 0;
};

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
                {badgeCount(page.props, item.badgeKey) > 0 && (
                  <SidebarMenuBadge className="bg-red-600 text-white peer-hover/menu-button:text-white peer-data-[active=true]/menu-button:text-white">
                    {badgeCount(page.props, item.badgeKey)}
                  </SidebarMenuBadge>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
