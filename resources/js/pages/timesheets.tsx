import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Timesheet } from '@/types';
import { Button } from '@/components/ui/button';
import { useTable } from '@/hooks/use-table';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table-2';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useDebouncer } from '@/hooks/use-debounced';
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Check, EllipsisVertical, Trash2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ProjectSelect } from '@/components/project-select';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/'
  },
  {
    title: 'Timesheets',
    href: route('timesheets')
  }
];

const columns: ColumnDef<Timesheet>[] = [
  {
    accessorKey: 'assignment.project.title',
    header: 'Project',
    cell: ({ row }) => {
      return row.original.assignment?.project?.title || 'N/A';
    }
  },
  {
    accessorKey: 'assignment.project.client.business_name',
    header: 'Client',
    cell: ({ row }) => {
      return row.original.assignment?.project?.client?.business_name || 'N/A';
    }
  },
  {
    accessorKey: 'hours',
    header: 'Total Hours',
    cell: ({ row }) => {
      return `${row.original.hours}h`;
    },
    meta: {
      center: true
    }
  },
  {
    accessorKey: 'km_traveled',
    header: 'KM Traveled',
    cell: ({ row }) => {
      return `${row.original.km_traveled} km`;
    },
    meta: {
      center: true
    }
  },
  {
    accessorKey: 'timesheet_items',
    header: 'Items',
    cell: ({ row }) => {
      return (
        <Badge variant="secondary">
          {row.original.timesheet_items_count || 0}
        </Badge>
      );
    },
    meta: {
      center: true
    }
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    cell: ({ row }) => {
      return new Date(row.original.created_at).toLocaleDateString();
    }
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      return <TimesheetActions timesheet={row.original} />;
    }
  }
];

export default function Timesheets() {
  const table = useTable('/api/v1/timesheets', {
    columns: columns,
    defaultParams: {
      'include': 'assignment.project.client,timesheet_items_count',
      'sort': '-created_at',
    }
  });

  return (
    <AppLayout
      breadcrumbs={breadcrumbs}>
      <div className="px-6">
        <DataTable
          table={table}
          left={
            <>
              <ProjectSelect
                renderTrigger={(project) => {
                  return (
                    <Button variant={'outline'}>
                      Project: <Badge>{project ? project.title : 'All'}</Badge>
                    </Button>
                  );
                }}
                className={'max-w-[250px]'}
                value={parseInt(table.searchParams.get('filter[project_id]') || '') || null}
                onValueChane={(value) => {
                  table.setSearchParams((params) => {
                    params.set('filter[project_id]', String(value || ''));
                    return params;
                  })
                }}
              />
            </>
          }
        />
      </div>
    </AppLayout>
  );
}

interface TimesheetActionsProps {
  timesheet: Timesheet;
}

export function TimesheetActions(props: TimesheetActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Check/>
            Approve
          </DropdownMenuItem>
          <DropdownMenuItem>
            <X />
            Request Change
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600">
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
