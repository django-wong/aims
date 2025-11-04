import {
  IconCamera,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconReport,
  IconSettings,
} from '@tabler/icons-react';
import * as React from 'react';

import { NavReports } from '@/components/nav-reports';
import { NavMain } from '@/components/nav-main';
// import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import { ArrowDownUpIcon, House, PlusIcon, ShieldUserIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HideFromClient, VisibleToClient } from '@/components/hide-from-client';
import { Badge } from '@/components/ui/badge';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    props: {
      auth: { org },
      menu: {
        main
      }
    },
  } = usePage<SharedData>();
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className={'py-2'}>
            <div className={'flex justify-between gap-2 items-center'}>
              <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                <a href="/" className={'flex items-center gap-2'}>
                  <House className="!size-6" />
                  <span className="text-base font-semibold">{org?.name}</span>
                </a>
              </SidebarMenuButton>
              <HideFromClient>
                {/*<Button size={'sm'} variant={'outline'}>*/}
                {/*  <ArrowDownUpIcon/>*/}
                {/*</Button>*/}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant={'outline'} size={'sm'}>
                      <a href={route('setup')}>
                        <PlusIcon/>
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent align={'start'}>
                    <p>Set up new organization</p>
                  </TooltipContent>
                </Tooltip>
              </HideFromClient>
              <VisibleToClient>
                <Badge variant={'outline'}>
                  <ShieldUserIcon/>
                  Client Portal
                </Badge>
              </VisibleToClient>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={Object.values(main)} />
        <NavReports/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
