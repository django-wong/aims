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
import { useRole } from '@/hooks/use-role';
import { useAuth } from '@/hooks/use-auth';
import { Link } from '@inertiajs/react';

interface MenuItem {
  name: string
  url: string
  icon: IconName,
  children?: MenuItem[]
}

export function NavReports() {
  const { isMobile } = useSidebar()
  const [menus, setMenus] = useState<MenuItem[]>([]);

  const {
    user
  } = useAuth();

  useEffect(() => {
    axios.get('/api/v1/menus/reports').then(response => {
      setMenus(response.data);
    })
  }, [user?.id])

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Report / KPIs</SidebarGroupLabel>
      <SidebarMenu>
        {menus.length === 0 && (
          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              <span>No reports available</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
        {menus.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link href={item.url}>
                <DynamicIcon name={item.icon} className={'size-6'} />
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            {(item.children || []).length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuAction className="data-[state=open]:bg-accent rounded-sm">
                    <IconDots />
                    <span className="sr-only">More</span>
                  </SidebarMenuAction>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="rounded-lg min-w-[200px]" side={isMobile ? 'bottom' : 'right'} align={isMobile ? 'end' : 'start'}>
                  {item.children?.map((item, index) => {
                    return (
                      <Link href={item.url} key={index}>
                        <DropdownMenuItem>
                          <DynamicIcon name={item.icon} />
                          <span>{item.name}</span>
                        </DropdownMenuItem>
                      </Link>
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
