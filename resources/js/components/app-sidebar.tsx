import {
  IconCamera,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconHelp,
  IconReport,
  IconSettings,
} from '@tabler/icons-react';
import * as React from 'react';

import { NavDocuments } from '@/components/nav-documents';
import { NavMain } from '@/components/nav-main';
import { NavSecondary } from '@/components/nav-secondary';
import { NavUser } from '@/components/nav-user';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';
import {
  House,
  Plus, ShieldUserIcon
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HideFromClient, VisibleToClient } from '@/components/hide-from-client';
import { Badge } from '@/components/ui/badge';

const data = {
  navClouds: [
    {
      title: 'Capture',
      icon: IconCamera,
      isActive: true,
      url: '/capture',
      items: [
        {
          title: 'Active Proposals',
          url: '/capture/active-proposals',
        },
        {
          title: 'Archived',
          url: '/capture/archived',
        },
      ],
    },
    {
      title: 'Proposal',
      icon: IconFileDescription,
      url: '/proposal',
      items: [
        {
          title: 'Active Proposals',
          url: '/proposal/active-proposals',
        },
        {
          title: 'Archived',
          url: '/proposal/archived',
        },
      ],
    },
    {
      title: 'Prompts',
      icon: IconFileAi,
      url: '/prompts',
      items: [
        {
          title: 'Active Proposals',
          url: '/prompts/active-proposals',
        },
        {
          title: 'Archived',
          url: '/prompts/archived',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Settings',
      url: '/settings',
      icon: IconSettings,
    },
    {
      title: 'Get Help',
      url: '/help',
      icon: IconHelp,
    },
  ],
  documents: [
    {
      name: 'Report A',
      url: '/data-library',
      icon: IconDatabase,
    },
    {
      name: 'Report B',
      url: '/reports',
      icon: IconReport,
    },
    {
      name: 'Report C',
      url: '/assistant',
      icon: IconFileWord,
    },
  ],
};

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
            <div className={'flex justify-between gap-4 items-center'}>
              <SidebarMenuButton asChild className="data-[slot=sidebar-menu-button]:!p-1.5">
                <a href="#" className={'flex items-center gap-2'}>
                  <House className="!size-6" />
                  <span className="text-base font-semibold">{org?.name}</span>
                </a>
              </SidebarMenuButton>
              <HideFromClient>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button asChild variant={'outline'} size={'icon'}>
                      <a href={route('setup')}>
                        <Plus size={18}/>
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
        {/*<NavDocuments items={data.documents} />*/}
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
