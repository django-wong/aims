import { BreadcrumbItem, User } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { EllipsisVertical, Plus } from 'lucide-react';
import { DataTable, useTableApi } from '@/components/data-table-2';
import { useTable } from '@/hooks/use-table';
import { ColumnDef } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

function describeUserRole(role: number): string {
  switch (role) {
    case 1:
      return 'System';
    case 2:
      return 'Organization Admin';
    case 3:
      return 'Finance';
    case 4:
      return 'PM';
    case 5:
      return 'Inspector';
    case 6:
      return 'Client';
    case 7:
      return 'Vendor';
    case 8:
      return 'Staff';
    default:
      return 'Unknown';
  }
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/'
  },
  {
    title: 'User & Access',
    href: '/users'
  }
];

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <>{row.original.name || 'N/A'}</>,
    size: 200,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <a href={`mailto:${row.original.email}`} className={'text-blue-500 hover:underline'}>
        {row.original.email}
      </a>
    ),
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => <>
      <Badge>
        {describeUserRole(row.original.user_role?.role || 0)}
      </Badge>
    </>,
  },
  {
    accessorKey: 'Actions',
    header: 'Actions',
    cell: ({row}) => (
      <UserActions user={row.original} />
    ),
  },
];

export default function Users() {
  const table = useTable('/api/v1/users', {
    columns: columns,
    defaultParams: {
      'filter[preset]': 'users',
      'include': 'user_role',
    }
  });

  function setFilterRole(value: string) {
    table.setSearchParams((prev) => {
      prev.set('filter[role]', value);
      return prev;
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs} pageAction={<Button> <Plus></Plus>Add</Button>}>
      <div className={'px-6'}>
        <DataTable
          left={<>
            <Tabs onValueChange={setFilterRole} value={table.searchParams.get('filter[role]') || ''} className="w-[400px]">
              <TabsList>
                <TabsTrigger value="">All</TabsTrigger>
                <TabsTrigger value="4">PM</TabsTrigger>
                <TabsTrigger value="5">Inspector</TabsTrigger>
              </TabsList>
            </Tabs>
          </>}
          table={table}
        />
      </div>
    </AppLayout>
  );
}


function UserActions({ user }: { user: User }) {
  const table = useTableApi<User>();
  return (
    <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size={'sm'}>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              View Details
              <DropdownMenuShortcut>⇧⌘V</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Duplicate
              <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Edit
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              className={'text-red-500'}
              disabled={true}
              onClick={() => {
                fetch(route('users.destroy', { id: user.id })).then((res) => {
                  if (res) {
                    table.reload();
                  }
                });
              }}
            >
              Delete
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>View Assignment</DropdownMenuItem>
            <DropdownMenuItem>View Project</DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
  );
}
