import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { ColumnDef } from '@tanstack/react-table';
import { EllipsisVertical, Eye, Mail, MessageSquare, Plus, Trash2 } from 'lucide-react';

import { ClientSelect } from '@/components/client-select';
import { DataTable } from '@/components/data-table-2';
import { SortButton } from '@/components/table';
import { useTable } from '@/hooks/use-table';
import AppLayout from '@/layouts/app-layout';
import { ProjectForm } from '@/pages/projects/form';
import { Project,  } from '@/types';
import { Head } from '@inertiajs/react';

const breadcrumbs = [
  {
    title: 'Home',
    href: '/app',
  },
  {
    title: 'Projects',
    href: '/app/projects',
  },
];

const columns: ColumnDef<Project>[] = [
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
    cell: () => <span>--</span>,
  },
  {
    accessorKey: 'job_type_id',
    header: 'Type',
    minSize: 120,
    maxSize: 120,
    cell: () => {
      return <span className="capitalize">--</span>;
    },
  },
  {
    accessorKey: 'title',
    header: 'Title',
    enableResizing: true,
    minSize: 100,
    size: 300,
    maxSize: 5000,
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
    cell: ({ row }) => (
      <span>
        {new Date(row.original.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
        })}
      </span>
    ),
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
  const table = useTable<Project>('/api/v1/projects', {
    columns: columns,
  });

  function changeStatus() {
    table.setSearchParams((searchParams) => {
      searchParams.set('status', searchParams.get('status') === 'open' ? 'closed' : 'open');
      return searchParams;
    });
  }

  return (
    <AppLayout
      breadcrumbs={breadcrumbs}
      pageAction={
        <ProjectForm onSubmit={() => table.reload()}>
          <Button>
            <Plus /> Create New Job
          </Button>
        </ProjectForm>
      }
    >
      <div className="px-6">
        <Head title={'Projects'} />
        <DataTable
          left={
            <>
              <Input
                className="max-w-[200px]"
                placeholder="Type to search..."
                value={table.searchParams.get('filter[keywords]') ?? ''}
                onChange={(event) => {
                  table.setSearchParams((searchParams) => {
                    searchParams.set('filter[keywords]', event.target.value);
                    return searchParams;
                  });
                }}
              />
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
                  });
                }}
                renderTrigger={(client) => (
                  <Button variant={'outline'}>
                    Client: <Badge variant={'secondary'}>{client?.business_name ?? client?.user?.name ?? 'All'}</Badge>
                  </Button>
                )}
                value={parseInt(table.searchParams.get('client') || '')}
              />
              {table.getSelectedRowModel().rows.length > 0 && (
                <Button variant={'destructive'}>
                  <Trash2 />
                  Delete
                </Button>
              )}
            </>
          }
          table={table}
          right={
            <Button variant={'outline'}>
              <Eye />
              View
            </Button>
          }
        />
      </div>
    </AppLayout>
  );
}
