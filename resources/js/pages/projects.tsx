import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { ColumnDef } from '@tanstack/react-table';
import { EllipsisVertical, Eye, Plus, Trash2 } from 'lucide-react';

import { ClientSelect } from '@/components/client-select';
import { ColumnToggle, DataTable } from '@/components/data-table-2';
import { useTable } from '@/hooks/use-table';
import AppLayout from '@/layouts/app-layout';
import { ProjectForm } from '@/pages/projects/form';
import { Project,  } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export function describeStatus(status: Project['status']) {
  // 0: Draft, 1: Open, 2: Closed
  switch (status) {
    case 0:
      return 'Draft';
    case 1:
      return 'Open';
    case 2:
      return 'Closed';
    default:
      return 'Unknown';
  }
}

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

function ProjectActions(props: { project: Project }) {
  return <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline">
        <EllipsisVertical />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel>{props.project.title}</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuGroup>
        <DropdownMenuItem>
          Duplicate
          <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
        </DropdownMenuItem>
        <DropdownMenuItem className={'text-red-500'}>
          Delete
          <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuGroup>
    </DropdownMenuContent>
  </DropdownMenu>;
}

const columns: ColumnDef<Project>[] = [
  {
    accessorKey: 'client',
    header: 'Client',
    minSize: 100,
    maxSize: 100,
    cell: ({row}) => row.original.client?.business_name || 'Unknown',
  },
  {
    accessorKey: 'po',
    header: 'PO',
    cell: ({ row }) => {
      return row.original.po_number;
    },
  },
  {
    accessorKey: 'project_type',
    header: 'Type',
    minSize: 120,
    maxSize: 120,
    cell: ({ row }) => {
      return row.original.project_type?.name ?? 'Unknown';
    },
  },
  {
    accessorKey: 'title',
    header: 'Title',
    enableResizing: true,
    minSize: 100,
    size: 300,
    maxSize: 5000,
    cell: ({ row }) => {
      return (
        <Link href={route('projects.edit', {id: row.original.id})} className={'underline'}>
          {row.original.title}
        </Link>
      );
    }
  },
  {
    accessorKey: 'budget',
    header: 'Budget',
    meta: {
      center: true,
    },
    cell: ({ row }) => {
      const budget = row.original.budget;
      return budget ? `$${budget.toLocaleString()}` : 'N/A';
    },
  },
  {
    accessorKey: 'status',
    minSize: 100,
    maxSize: 100,
    header: 'Status',
    cell: ({ row }) => {
      return <Badge
        variant={'outline'} className={cn('bg-transparent capitalize', 'project-status-' + row.original.status)}>{describeStatus(row.original.status)}
      </Badge>
    },
    meta: {
      center: true,
    }
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ProjectActions project={row.original} />,
  },
];

export default function Projects() {
  const table = useTable<Project>('/api/v1/projects', {
    columns: columns,
    defaultParams: {
      'include': 'client,project_type',
    }
  });

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
              <ClientSelect
                canCreateNew={true}
                className={'w-auto'}
                onValueChane={(value) => {
                  table.setSearchParams((prev) => {
                    if (value) {
                      prev.set('filter[client_id]', String(value));
                    } else {
                      prev.delete('filter[client_id]');
                    }
                    return prev;
                  });
                }}
                renderTrigger={(client) => (
                  <Button variant={'outline'}>
                    Client: <Badge variant={'secondary'}>{client?.business_name ?? client?.user?.name ?? 'All'}</Badge>
                  </Button>
                )}
                value={parseInt(table.searchParams.get('filter[client_id]') || '')}
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
            <ColumnToggle/>
          }
        />
      </div>
    </AppLayout>
  );
}
