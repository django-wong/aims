import { SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';

export interface MainNavItem {
  name: string;
  url: string;
  icon: IconName;
  badge?: string; // Optional badge text
}

export function NavMain({
  items,
}: {
  items: MainNavItem[]
}) {
  const isActive = (item: MainNavItem) => {
    const url = new URL(item.url);
    return window.location.href.startsWith(url.origin + url.pathname);
  };

  return (
    <SidebarGroup className={'flex-grow'}>
      <SidebarGroupLabel>Main</SidebarGroupLabel>
      <SidebarGroupContent className="flex flex-col gap-2">
        {items.length === 0 && (
          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              <span>No menu available</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}

        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton tooltip={item.name} asChild data-active={isActive(item)}>
                <Link href={item.url} className={'flex items-center gap-2'}>
                  <DynamicIcon name={item.icon} className={'size-6 shrink-0'} />
                  <span className={'flex-grow'}>{item.name}</span>
                  {
                    item.badge ? (
                      <Badge variant={'outline'} className={'shrink-0'}> {item.badge}</Badge>
                    ) : null
                  }
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
