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
import { Input } from '@/components/ui/input';
import { ColumnDef } from '@tanstack/react-table';
import { EllipsisVertical, Eye, Plus, Trash2 } from 'lucide-react';

import { ClientSelect } from '@/components/client-select';
import { ColumnToggle, DataTable } from '@/components/data-table-2';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { useTable } from '@/hooks/use-table';
import AppLayout from '@/layouts/app-layout';
import { ProjectForm } from '@/pages/projects/form';
import { Project } from '@/types';
import { Head, Link } from '@inertiajs/react';

const breadcrumbs = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Projects',
    href: '/projects',
  },
];

function ProjectActions(props: { project: Project }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size={'sm'}>
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" side={'bottom'} align={'end'}>
        <DropdownMenuLabel>{props.project.title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            View Details
            <DropdownMenuShortcut>
              <Eye />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={'text-red-500'}
            onSelect={(event) => {
              event.stopPropagation();
            }}
          >
            Delete
            <DropdownMenuShortcut>
              <Trash2 />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const columns: ColumnDef<Project>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    enableResizing: true,
    minSize: 100,
    size: 300,
    maxSize: 5000,
    cell: ({ row }) => {
      return (
        <Link href={route('projects.edit', { id: row.original.id })} className={'underline'}>
          {row.original.title}
        </Link>
      );
    },
  },
  {
    accessorKey: 'number',
    header: 'P.N',
    cell: ({ row }) => {
      return <div>{row.original.number || 'N/A'}</div>;
    },
  },
  {
    accessorKey: 'project_type',
    header: 'Type',
    cell: ({ row }) => {
      return <Badge variant={'secondary'}>{row.original.project_type?.name ?? 'Unknown'}</Badge>;
    },
  },
  {
    accessorKey: 'client',
    header: 'Client',
    size: 10000,
    cell: ({ row }) => row.original.client?.business_name || 'Unknown',
  },
  {
    accessorKey: 'actions',
    header: () => {
      return <TableCellWrapper last>Actions</TableCellWrapper>;
    },
    cell: ({ row }) => {
      return (
        <TableCellWrapper last>
          <ProjectActions project={row.original} />
        </TableCellWrapper>
      );
    },
  },
];

export default function Projects() {
  const table = useTable<Project>('/api/v1/projects', {
    columns: columns,
    defaultParams: {
      include: 'client,project_type',
    },
  });

  return (
    <AppLayout
      breadcrumbs={breadcrumbs}
      pageAction={
        <ProjectForm onSubmit={() => table.reload()}>
          <Button>
            <Plus /> New
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
                  Delete ({table.getSelectedRowModel().rows.length} selected)
                </Button>
              )}
            </>
          }
          table={table}
          right={<ColumnToggle />}
        />
      </div>
    </AppLayout>
  );
}
