import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Timesheet } from '@/types';
import { Button } from '@/components/ui/button';
import { useTable } from '@/hooks/use-table';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable, useTableApi } from '@/components/data-table-2';

import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ProjectSelect } from '@/components/project-select';
import { PopoverConfirm } from '@/components/popover-confirm';
import axios from 'axios';

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
  const table = useTableApi();
  return (
    <PopoverConfirm
      message={'Are you sure you want to delete this timesheet?'}
      onConfirm={() => {
        axios.delete('/api/v1/timesheets/' + props.timesheet.id).then(() => {
          table.reload();
        })
      }}
      side={'bottom'} align={'end'}>
      <Button variant="ghost" size="sm">
        <Trash2 />
      </Button>
    </PopoverConfirm>
  );
}
