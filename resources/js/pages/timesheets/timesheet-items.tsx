import { ColumnToggle, DataTable, useTableApi } from '@/components/data-table-2';
import { Button } from '@/components/ui/button';
import { useTable } from '@/hooks/use-table';
import { Assignment, Timesheet, TimesheetItem } from '@/types';
import {
  PencilIcon,
} from 'lucide-react';
import { TimesheetItemForm } from '@/pages/timesheet-items/form';
import { ComponentProps } from 'react';

interface TimesheetItemsProps {
  timesheet?: Timesheet;
  assignment?: Assignment
  datatable?: Partial<
    ComponentProps<typeof DataTable>
  >
}

export function TimesheetItems(props: TimesheetItemsProps) {
  const table = useTable<TimesheetItem>('/api/v1/timesheet-items', {
    selectable: false,
    defaultParams: {
      'filter[timesheet_id]': String(props.timesheet?.id ?? ''),
      'filter[assignment_id]': String(props.assignment?.id ?? ''),
      'sort': '-date'
    },
    initialState: {
      columnPinning: {
        left: ['date'],
        right: ['actions'],
      },
      pagination: {
        pageSize: 2,
      },
    },
    columns: [
      {
        accessorKey: 'date',
        header: 'Date',
        size: 200,
        cell: ({ row }) => new Date(row.original.date || Date.now()).toLocaleDateString(),
        enablePinning: true,
      },
      {
        accessorKey: 'work_hours',
        header: 'W/T/R (hours)',
        size: 100,
        cell: ({ row }) => (
          <>
            {row.original.work_hours} / {row.original.travel_hours} / {row.original.report_hours}
          </>
        ),
      },
      {
        accessorKey: 'days',
        header: 'Days & Overnights',
        size: 100,
        cell: ({ row }) => `${row.original.days} / ${row.original.overnights}`,
      },
      {
        accessorKey: 'travel_distance',
        header: 'Travel Distance',
        size: 150,
        cell: ({ row }) => row.original.travel_distance,
      },
      {
        accessorKey: 'travel_rate',
        header: 'Travel Rate',
        size: 150,
        cell: ({ row }) => row.original.travel_rate.toFixed(2),
      },
      {
        accessorKey: 'expenses',
        header: 'Hotel ($)',
        size: 150,
        cell: ({ row }) => row.original.hotel,
      },
      {
        accessorKey: 'rail_or_airfare',
        header: 'Rail/Airfare ($)',
        size: 150,
        cell: ({ row }) => row.original.rail_or_airfare,
      },
      {
        accessorKey: 'meals',
        header: 'Meals ($)',
        size: 150,
        cell: ({ row }) => row.original.meals,
      },
      {
        accessorKey: 'actions',
        header: 'Actions',
        size: 150,
        enablePinning: true,
        cell: ({ row }) => {
          return <TimesheetItemActions value={row.original}/>;
        },
      },
    ],
  });

  return (
    <>
      <DataTable
        {...props.datatable}
        table={table}
        className={'overflow-x-auto'}
      />
    </>
  );
}

interface TimesheetItemActionsProps {
  value: TimesheetItem;
}

function TimesheetItemActions(props: TimesheetItemActionsProps) {
  const table = useTableApi();

  function onSubmit() {
    table.reload();
  }

  return (
    <>
      <div className={'flex justify-end items-center gap-2'}>
        <TimesheetItemForm value={props.value} onSubmit={onSubmit}>
          <Button variant={'secondary'} size={'sm'}>
            <PencilIcon/>
          </Button>
        </TimesheetItemForm>
      </div>
    </>
  );
}
