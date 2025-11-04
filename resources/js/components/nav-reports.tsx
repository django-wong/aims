"use client"

import {
  IconDots,
} from "@tabler/icons-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { Link } from '@inertiajs/react';

export interface ReportMenuItem {
  name: string
  url: string
  icon: IconName,
  children?: ReportMenuItem[]
}

interface NavReportsProps {
  items: ReportMenuItem[]
}

export function NavReports(props: NavReportsProps) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Report / KPIs</SidebarGroupLabel>
      <SidebarMenu>
        {props.items.length === 0 && (
          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              <span>No reports available</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
        {props.items.map((item) => (
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
      </SidebarMenu>
    </SidebarGroup>
  );
}
