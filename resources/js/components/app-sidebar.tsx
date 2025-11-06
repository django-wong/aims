import * as React from 'react';

import { NavReports } from '@/components/nav-reports';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Button } from '@/components/ui/button';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Org, SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ArrowDownUpIcon, ChevronDownIcon, House, PlusIcon, ShieldUserIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { HideFromClient, VisibleToClient } from '@/components/hide-from-client';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
} from './ui/dropdown-menu';
import { DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { usePagedGetApi } from '@/hooks/use-get-api';
import { useOrg } from '@/hooks/use-org';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const {
    data: orgs
  } = usePagedGetApi<Org>('/api/v1/orgs', {
    pageSize: 999
  });

  const currentOrg = useOrg();

  const {
    props: {
      privileges: {
        can_switch_org
      },
      auth: { org },
      menu: {
        main,
        reports
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
              {
                can_switch_org ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant={'outline'} size={'xs'}>
                        <ChevronDownIcon/>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                      <DropdownMenuLabel>
                        <Tooltip>
                          <TooltipTrigger>
                            Switch to...
                          </TooltipTrigger>
                          <TooltipContent>
                            Impersonate one of the admin from selected organization.
                          </TooltipContent>
                        </Tooltip>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator/>
                      {
                        orgs?.map(function (org, index) {
                          return (
                            <DropdownMenuItem disabled={org.id === currentOrg?.id} key={index} onClick={() => {
                              window.location.href = route('org.switch', org.id);
                            }}>
                              {org.name}
                              <DropdownMenuShortcut>
                                <Badge variant={'outline'}>{org.code}</Badge>
                              </DropdownMenuShortcut>
                            </DropdownMenuItem>
                          );
                        })
                      }
                      <DropdownMenuSeparator />
                      <Link href={route('setup')}>
                        <DropdownMenuItem>
                          Create New Organization
                          <DropdownMenuShortcut>
                            <PlusIcon/>
                          </DropdownMenuShortcut>
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : null
              }
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
        <NavReports items={reports}/>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
