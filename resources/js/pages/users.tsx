import { DataTable, useTableApi } from '@/components/data-table-2';
import { RoleSelect } from '@/components/role-select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTable } from '@/hooks/use-table';
import AppLayout from '@/layouts/app-layout';
import { UserForm } from '@/pages/users/form';
import { BreadcrumbItem, SharedData, User } from '@/types';
import { Link, usePage } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { ChevronDown, Edit, EllipsisVertical, Plus, ScanFace, Trash2 } from 'lucide-react';
import { startTransition, useEffect, useState } from 'react';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { Input } from '@/components/ui/input';
import { useDebouncer } from '@/hooks/use-debounced';

function describeUserRole(role: number): string {
  switch (role) {
    case 1:
      return 'System';
    case 2:
      return 'Admin';
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
    href: '/',
  },
  {
    title: 'User & Access',
    href: '/users',
  },
];

export function UserName({ user }: { user: User }) {
  return (
    <UserForm onSubmit={() => {}} value={user}>
      <span>{user.name || 'N/A'}</span>
    </UserForm>
  );
}

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <UserName user={row.original} />,
    size: 200,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 300,
    cell: ({ row }) => (
      <a href={`mailto:${row.original.email}`} className={'text-blue-500 hover:underline'}>
        {row.original.email}
      </a>
    ),
  },
  {
    accessorKey: 'role',
    header: 'User Role',
    size: Infinity,
    cell: ({ row }) => (
      <>
        <UserRoleBadge user={row.original} />
      </>
    ),
  },
  {
    accessorKey: 'Actions',
    header: () => (
      <TableCellWrapper last>
        Actions
      </TableCellWrapper>
    ),
    cell: ({ row }) => (
      <TableCellWrapper last>
        <UserActions user={row.original} />
      </TableCellWrapper>
    ),
  },
];

export default function Users() {
  const table = useTable('/api/v1/users', {
    columns: columns,
    defaultParams: {
      'filter[preset]': 'users',
      'sort': 'name',
      include: 'user_role',
    },
  });

  function setFilterRole(value: string) {
    table.setSearchParams((prev) => {
      prev.set('filter[role]', value);
      return prev;
    });
  }

  const [keywords, setKeywords] = useState(table.searchParams.get('filter[keywords]') || '');

  const debouncer = useDebouncer();

  return (
    <AppLayout
      breadcrumbs={breadcrumbs}
      pageAction={
        <UserForm onSubmit={() => {}}>
          <Button>
            <Plus/> New
          </Button>
        </UserForm>
      }>
      <div className={'px-6'}>
        <DataTable
          left={
            <>
              <Input
                value={keywords}
                onChange={(event) => {
                  setKeywords(event.target.value);
                  debouncer(() => {
                    table.setSearchParams((prev) => {
                      prev.set('filter[keywords]', event.target.value);
                      return prev;
                    });
                  });
                }}
                placeholder={'Search by name or email'}
                className={'max-w-[250px]'}
              />
              <Tabs onValueChange={setFilterRole} value={table.searchParams.get('filter[role]') || ''}>
                <TabsList>
                  <TabsTrigger value="">All</TabsTrigger>
                  {/* 2, 3, 4, 7, 8 */}
                  <TabsTrigger value="2">Admin</TabsTrigger>
                  <TabsTrigger value="3">Finance</TabsTrigger>
                  <TabsTrigger value="4">PM</TabsTrigger>
                  <TabsTrigger value="8">Staff</TabsTrigger>
                </TabsList>
              </Tabs>
            </>
          }
          table={table}
        />
      </div>
    </AppLayout>
  );
}

function UserActions({ user }: { user: User }) {
  const [open, setOpen] = useState(false);

  const table = useTableApi<User>();

  const {
    props: { auth },
  } = usePage<SharedData>();

  const canImpersonate = user.id !== auth.user?.id;

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size={'sm'}>
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" side={'bottom'} align={'end'}>
          <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={() => {
                setTimeout(() => {
                  setOpen(true);
                }, 200)
              }}
            >
              Edit
              <DropdownMenuShortcut>
                <Edit className={'size-4'} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem
              className={'text-red-500'}
              onClick={() => {
                axios.delete(route('users.destroy', { id: user.id })).then((res) => {
                  if (res) {
                    table.reload();
                  }
                });
              }}
            >
              Delete
              <DropdownMenuShortcut>
                <Trash2 className={'size-4'} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <Link href={route('impersonate', { id: user.id })}>
              <DropdownMenuItem disabled={!canImpersonate}>
                Impersonate
                <DropdownMenuShortcut>
                  <ScanFace className={'size-4'} />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
      <UserForm
        open={open}
        onOpenChange={setOpen}
        onSubmit={(data) => {
          startTransition(() => {
            table.reload();
            setOpen(false);
            console.info(data);
          });
        }}
        value={user}
      />
    </div>
  );
}

export const UserRoleBadge = ({ user }: { user: User }) => {
  const [role, setRole] = useState(user.user_role?.role || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user.user_role?.role) {
      setRole(user.user_role.role);
    } else {
      setRole(null);
    }
  }, [user.user_role?.role]);

  function save(role_id: number) {
    setLoading(true);
    axios
      .post(route('users.update_role', { id: user.id }), {
        role: role_id,
      })
      .then((res) => {
        if (res) {
          setRole(role_id);
        }
      });
    setLoading(false);
  }

  return (
    <RoleSelect
      onValueChane={(value) => {
        if (value) {
          save(value);
        }
      }}
      value={user.user_role?.role || null}
      renderTrigger={() => {
        return loading ? (
          <>saving...</>
        ) : (
          <Badge variant={'secondary'} className={'cursor-pointer'}>
            {describeUserRole(role || 0)}
            <ChevronDown className={'size-2'} />
          </Badge>
        );
      }}
    />
  );
};
