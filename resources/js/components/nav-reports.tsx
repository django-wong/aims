"use client"

import {
  IconDots,
} from "@tabler/icons-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

import { DynamicIcon, IconName } from 'lucide-react/dynamic';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface MenuItem {
  name: string
  url: string
  icon: IconName,
  children?: MenuItem[]
}

export function NavReports() {
  const { isMobile } = useSidebar()
  const [menus, setMenus] = useState<MenuItem[]>([]);

  useEffect(() => {
    axios.get('/api/v1/menus/reports').then(response => {
      setMenus(response.data);
    })
  }, [])

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Report / KPIs</SidebarGroupLabel>
      <SidebarMenu>
        {menus.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <a href={item.url}>
                <DynamicIcon name={item.icon} className={'size-6'} />
                <span>{item.name}</span>
              </a>
            </SidebarMenuButton>
            {(item.children || []).length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction className="data-[state=open]:bg-accent rounded-sm">
                    <IconDots />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-lg" side={isMobile ? 'bottom' : 'right'} align={isMobile ? 'end' : 'start'}>
                  <DropdownMenuLabel>More...</DropdownMenuLabel>
                  <DropdownMenuSeparator/>
                  {item.children?.map((item, index) => {
                    return (
                      <DropdownMenuItem key={index}>
                        <DynamicIcon name={item.icon} />
                        <span>{item.name}</span>
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </SidebarMenuItem>
        ))}
        {/*<SidebarMenuItem>*/}
        {/*  <SidebarMenuButton className="text-sidebar-foreground/70">*/}
        {/*    <IconDots className="text-sidebar-foreground/70" />*/}
        {/*    <span>More</span>*/}
        {/*  </SidebarMenuButton>*/}
        {/*</SidebarMenuItem>*/}
      </SidebarMenu>
    </SidebarGroup>
  );
}
