import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { router } from '@inertiajs/react';

export interface MainNavItem {
  name: string;
  url: string;
  icon: IconName;
  component?: string; // Optional, if you want to use a client-side visit
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
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton tooltip={item.name} asChild data-active={isActive(item)}>
                <a href={item.url}
                   onClick={(event) => {
                      // If the item has a component, we can handle it client-side
                      if (item.component) {
                        event.preventDefault();
                        event.stopPropagation();
                        router.push({
                          url: item.url,
                          component: item.component,
                        })
                      }
                   }}>
                  <DynamicIcon name={item.icon} className={'size-6'} />
                  <span>{item.name}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
