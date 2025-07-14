import { IconCirclePlusFilled, IconMail, type Icon } from "@tabler/icons-react"
import { Bell, type LucideIcon } from 'lucide-react';

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Badge } from '@/components/ui/badge';

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon | Icon
  }[]
}) {
  const isActive = (item: { title: string; url: string; icon?: LucideIcon | Icon }) => {
    return window.location.pathname === item.url;
  };

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="New Organization"
            >
              <IconCirclePlusFilled />
              <span>New Organization</span>
            </SidebarMenuButton>
            <Badge variant={'default'}>
              <Bell/>
              20+
            </Badge>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} asChild data-active={isActive(item)}>
                <a href={item.url}>
                  {item.icon && <item.icon className="size-6" />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
