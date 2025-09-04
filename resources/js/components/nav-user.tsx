import {
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconUserCircle,
} from "@tabler/icons-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { SettingsIcon, Undo2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function NavUser() {
  const { isMobile } = useSidebar()
  const {
    props: {
      auth: {
        user,
        impersonating
      }
    }
  } = usePage<SharedData>();

  if (!user) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <Avatar className="h-8 w-8 rounded-lg grayscale border">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">{user.name.substring(0, 2)}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="text-muted-foreground truncate text-xs">{user.email}</span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? 'bottom' : 'right'}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">{user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="text-muted-foreground truncate text-xs">{user.email}</span>
                </div>
                <Badge>
                  {describe_user_role(user.user_role?.role)}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {/*<DropdownMenuItem>*/}
              {/*  <IconUserCircle />*/}
              {/*  Account*/}
              {/*</DropdownMenuItem>*/}
              <Link href={'/settings'}>
                <DropdownMenuItem>
                  <SettingsIcon />
                  Settings
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            {impersonating && (
              <Link href={route('leave-impersonation')}>
                <DropdownMenuItem>
                  <Undo2 className={'stroke-red-500'} />
                  <span className={'text-red-500'}>Leave Impersonation</span>
                </DropdownMenuItem>
              </Link>
            )}
            <Link href={route('logout')}>
              <DropdownMenuItem>
                <IconLogout />
                Log out
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function describe_user_role(role: number|string|null|undefined) {
  switch (role?.toString()) {
    case '1':
      return 'System Admin';
    case '2':
      return 'Admin';
    case '3':
      return 'Finance';
    case '4':
      return 'PM';
    case '5':
      return 'Inspector';
    case '6':
      return 'Client';
    case '7':
      return 'Vendor';
    case '8':
      return 'Staff';
    default:
      return 'User';
  }
}
