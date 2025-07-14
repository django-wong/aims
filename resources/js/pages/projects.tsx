import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import {
  ColumnDef,
} from '@tanstack/react-table';
import {
  EllipsisVertical,
  Eye,
  Mail,
  MessageSquare,
  Plus,
  Trash2,
  TrendingDownIcon,
  TrendingUpIcon,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub, DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { Head, usePage } from '@inertiajs/react';
import { Job, SharedData } from '@/types';
import { ProjectForm } from '@/pages/projects/form';
import { useTable } from '@/hooks/use-table';
import { ClientSelect } from '@/components/client-select';
import { SortButton } from '@/components/table';
import { DataTable } from '@/components/data-table';
import AppLayout from '@/layouts/app-layout';

const breadcrumbs = [
  {
    title: 'Home',
    href: '/app',
  },
  {
    title: 'Jobs',
    href: '/app/jobs',
  },
];

const columns: ColumnDef<Job>[] = [
  {
    accessorKey: 'select',
    header: ({ table }) => <Checkbox checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}></Checkbox>,
    cell: ({ row }) => <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} />,
    minSize: 32,
    maxSize: 32,
  },
  {
    accessorKey: 'id',
    header: 'ID',
    minSize: 50,
    maxSize: 50,
  },
  {
    accessorKey: 'client',
    header: 'Client',
    minSize: 100,
    maxSize: 100,
    cell: ({ row }) => <span>{row.original.client?.name || '--'}</span>,
  },
  {
    accessorKey: 'job_type_id',
    header: 'Type',
    minSize: 120,
    maxSize: 120,
    cell: ({ row }) => {
      return <span className="capitalize">{row.original.job_type?.name || '--'}</span>;
    },
  },
  {
    accessorKey: 'title',
    header: 'Title',
    enableResizing: true,
    minSize: 100,
    size: 300,
    maxSize: 5000
  },
  {
    accessorKey: 'status',
    minSize: 100,
    maxSize: 100,
    header: () => (
      <div className="flex items-center justify-center pl-2">
        {/*
          onClick={header.column.getToggleSortingHandler()}
        */}
        <SortButton value={null} onSortChange={(event) => console.info(event)}>
          <TableCellWrapper variant={'header'}>Status</TableCellWrapper>
        </SortButton>
      </div>
    ),
    cell: ({ row }) => {
      const status: string = row.getValue('status');
      return (
        <div className={'flex justify-center'}>
          <Badge variant={'default'} className={`!text-${status === 'open' ? 'green' : 'red'}-500`}>
            {status || 'unknown'}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    minSize: 100,
    size: 100,
    maxSize: 100,
    cell: ({ row }) => <span>
      {
        new Date(row.original.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })
      }
    </span>,
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    minSize: 40,
    maxSize: 40,
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          {/*<DropdownMenuLabel>My Account</DropdownMenuLabel>*/}
          {/*<DropdownMenuSeparator />*/}
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
            <DropdownMenuItem className={'text-red-500'}>
              Delete
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem disabled={true}>View Client</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Send Notice</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem>
                    Email
                    <DropdownMenuShortcut>
                      <Mail />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    SMS
                    <DropdownMenuShortcut>
                      <MessageSquare />
                    </DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

export default function Projects() {
  const {props} = usePage<SharedData>();
  const table = useTable<Job>('/api/v1/jobs', {
    columns: columns,
  });
  function changeStatus() {
    table.setSearchParams((searchParams) => {
      searchParams.set('status', searchParams.get('status') === 'open' ? 'closed' : 'open');
      return searchParams;
    })
  }
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="p-4">
        <Head title={'Jobs'} />
        <div className="py-2 pb-6">
          <h1 className="text-xl font-bold text-gray-800">Welcome back!</h1>
          <p className="text-gray-500 text-sm">
            {props.quote.message} - {props.quote.author}
          </p>
        </div>
        <SectionCards/>
        <div className="mb-4 flex gap-2 flex-wrap">
          <ProjectForm
            onSuccess={() => table.reload()}
            trigger={
              <Button>
                <Plus /> Create New Job
              </Button>
            }
          />
          <Input
            className="max-w-[200px]" placeholder="Type to search..." value={table.searchParams.get('filter[keywords]') ?? ''}
            onChange={(event) => {
            table.setSearchParams((searchParams) => {
              searchParams.set('filter[keywords]', event.target.value);
              return searchParams;
            })
          }}/>
          <Button variant={'outline'} onClick={changeStatus}>
            Status: <Badge variant={'secondary'}>{table.searchParams.get('status') || 'All'}</Badge>
          </Button>
          <Button variant={'outline'} onClick={() => table.reload()}>
            Type
            <Badge variant={'secondary'}>{table.searchParams.get('type') || 'All'}</Badge>
          </Button>
          <ClientSelect
            canCreateNew={true}
            className={'w-auto'}
            onValueChane={(value) => {
              table.setSearchParams((prev) => {
                prev.set('client', String(value));
                return prev;
              })
            }}
            renderTrigger={(client) => (
              <Button variant={'outline'}>
                Client: <Badge variant={'secondary'}>{client?.name ?? 'All'}</Badge>
              </Button>
            )}
            value={
              parseInt(table.searchParams.get('client') || '')
            }
          />
          {table.getSelectedRowModel().rows.length > 0 && (
            <Button variant={'destructive'}>
              <Trash2 />
              Delete
            </Button>
          )}
          <div className="grow"></div>
          <Button variant={'outline'}>
            <Eye />
            View
          </Button>
        </div>
        <DataTable table={table} columns={columns}/>
      </div>
    </AppLayout>
  );
}

export function SectionCards() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card mb-4 grid grid-cols-1 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4">
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Total Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">$1,250.00</CardTitle>
          <div className="absolute top-4 right-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </Badge>
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>New Customers</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">1,234</CardTitle>
          <div className="absolute top-4 right-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingDownIcon className="size-3" />
              -20%
            </Badge>
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Active Accounts</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">45,678</CardTitle>
          <div className="absolute top-4 right-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +12.5%
            </Badge>
          </div>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader className="relative">
          <CardDescription>Growth Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">4.5%</CardTitle>
          <div className="absolute top-4 right-4">
            <Badge variant="outline" className="flex gap-1 rounded-lg text-xs">
              <TrendingUpIcon className="size-3" />
              +4.5%
            </Badge>
          </div>
        </CardHeader>
      </Card>
    </div>
  );
}
