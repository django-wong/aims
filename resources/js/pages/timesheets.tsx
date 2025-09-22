import { DataTable, useTableApi } from '@/components/data-table-2';
import { Button } from '@/components/ui/button';
import { useTable } from '@/hooks/use-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Timesheet } from '@/types';
import { ColumnDef } from '@tanstack/react-table';

import { PopoverConfirm } from '@/components/popover-confirm';
import { ProjectSelect } from '@/components/project-select';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { Link } from '@inertiajs/react';
import { CreateInvoiceButton } from '@/pages/assignments/create-invoice-button';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Timesheets',
    href: route('timesheets'),
  },
];

const columns: ColumnDef<Timesheet>[] = [
  {
    accessorKey: 'inspector_name',
    header: 'Inspector',
    cell: ({ row }) => {
      return <Link className={'underline'} href={route('timesheets.edit', row.original.id)}>
        {row.original.inspector_name}
      </Link>;
    },
  },
  {
    accessorKey: 'assignment.reference_number',
    header: 'Assignment',
    cell: ({ row }) => {
      return row.original.assignment?.reference_number || 'N/A';
    },
  },
  {
    accessorKey: 'assignment.project.client.business_name',
    header: 'Client',
    cell: ({ row }) => {
      return row.original.assignment?.project?.client?.business_name || 'N/A';
    },
  },
  {
    accessorKey: 'week',
    header: 'Week',
    cell: ({ row }) => {
      return `${row.original.week}`;
    }
  },
  {
    accessorKey: 'hours',
    header: 'Total Hours',
    cell: ({ row }) => {
      return `${row.original.hours}h`;
    },
    meta: {
      center: true,
    },
  },
  {
    accessorKey: 'travel_distance',
    header: 'Mileage',
    cell: ({ row }) => {
      return `${row.original.travel_distance} km`;
    },
    meta: {
      center: true,
    },
  },
  {
    accessorKey: 'timesheet_items',
    header: 'Submissions',
    cell: ({ row }) => {
      return (
        <Tooltip>
          <TooltipTrigger>
            <Badge variant="secondary">{row.original.timesheet_items?.length || 0}</Badge>
          </TooltipTrigger>
          <TooltipContent>
            <div>
              {row.original.timesheet_items?.length ? (
                row.original.timesheet_items.map((item) => (
                  <div key={item.id} className="flex items-center gap-6">
                    <div className="flex-grow font-semibold">{item.user?.name}</div>
                    <div className="flex items-center gap-2 text-sm">
                      <span>{item.hours}h, </span>
                      <span>{item.travel_distance} distance</span>
                    </div>
                  </div>
                ))
              ) : (
                <span>No submission found</span>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      );
    },
    meta: {
      center: true,
    },
  },
  {
    accessorKey: 'actions',
    header: () => (
      <TableCellWrapper last>
        Actions
      </TableCellWrapper>
    ),
    cell: ({ row }) => {
      return <TimesheetActions timesheet={row.original} />;
    },
  },
];

export default function Timesheets() {
  const table = useTable('/api/v1/timesheets', {
    selectable: true,
    columns: columns,
    defaultParams: {
      include: 'assignment.project.client,timesheet_items_count,timesheet_items.user',
      sort: '-created_at',
    },
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="grid grid-cols-1 gap-6 px-6">
        <DataTable
          table={table}
          left={
            <>
              <ProjectSelect
                placeholder={'Filter by Project'}
                className={'max-w-[250px]'}
                value={parseInt(table.searchParams.get('filter[project_id]') || '') || null}
                onValueChane={(value) => {
                  table.setSearchParams((params) => {
                    params.set('filter[project_id]', String(value || ''));
                    return params;
                  });
                }}
              />
            </>
          }
          right={
            <>
              <CreateInvoiceButton/>
            </>
          }
        />
        <div></div>
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
    <div className={'flex items-center justify-end gap-2'}>
      <PopoverConfirm
        asChild
        message={'Are you sure you want to delete this timesheet?'}
        onConfirm={() => {
          axios.delete('/api/v1/timesheets/' + props.timesheet.id).then(() => {
            table.reload();
          });
        }}
        side={'bottom'}
        align={'end'}
      >
        <Button variant="secondary" size="sm">
          <Trash2 />
        </Button>
      </PopoverConfirm>
    </div>
  );
}
