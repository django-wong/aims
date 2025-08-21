import { DataTable, useTableApi } from '@/components/data-table-2';
import { Button } from '@/components/ui/button';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { useTable } from '@/hooks/use-table';
import { TimesheetItemForm } from '@/pages/timesheet-items/form';
import { Assignment, Timesheet, TimesheetItem } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { PencilIcon } from 'lucide-react';
import { ComponentProps } from 'react';

interface TimesheetItemsProps {
  timesheet?: Timesheet;
  assignment?: Assignment;
  datatable?: Partial<ComponentProps<typeof DataTable>>;
  actions?: (item: TimesheetItem) => React.ReactNode;
}

export function TimesheetItems(props: TimesheetItemsProps) {
  const columns: ColumnDef<TimesheetItem>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => new Date(row.original.date || Date.now()).toLocaleDateString(),
      enablePinning: true,
    },
    {
      accessorKey: 'work_hours',
      header: 'W/T/R (hours)',
      cell: ({ row }) => (
        <>
          {row.original.work_hours} / {row.original.travel_hours} / {row.original.report_hours}
        </>
      ),
    },
    {
      accessorKey: 'days',
      header: 'Days & Overnights',
      cell: ({ row }) => `${row.original.days} / ${row.original.overnights}`,
    },
    {
      accessorKey: 'travel_distance',
      header: 'Travel Distance',
      cell: ({ row }) => row.original.travel_distance,
    },
    {
      accessorKey: 'travel_rate',
      header: 'Travel Rate',
      cell: ({ row }) => row.original.travel_rate.toFixed(2),
    },
    {
      accessorKey: 'expenses',
      header: 'Hotel ($)',
      cell: ({ row }) => row.original.hotel,
    },
    {
      accessorKey: 'rail_or_airfare',
      header: 'Rail/Airfare ($)',
      cell: ({ row }) => row.original.rail_or_airfare,
    },
    {
      accessorKey: 'meals',
      header: 'Meals ($)',
      cell: ({ row }) => row.original.meals,
    },
  ];

  if (typeof props.actions === 'function') {
    const action: ColumnDef<TimesheetItem> = {
      accessorKey: 'actions',
      header: () => <TableCellWrapper last>Actions</TableCellWrapper>,
      size: 150,
      enablePinning: true,
      cell: ({ row }) => {
        return <TableCellWrapper last>{props.actions?.(row.original)}</TableCellWrapper>;
      },
    };

    columns.push(action);
  }

  const table = useTable<TimesheetItem>('/api/v1/timesheet-items', {
    selectable: false,
    defaultParams: {
      'filter[timesheet_id]': String(props.timesheet?.id ?? ''),
      'filter[assignment_id]': String(props.assignment?.id ?? ''),
      sort: '-date',
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
    columns: columns,
  });

  return (
    <>
      <DataTable {...props.datatable} table={table} />
    </>
  );
}

interface TimesheetItemActionsProps {
  value: TimesheetItem;
  editable: boolean;
}

export function TimesheetItemActions(props: TimesheetItemActionsProps) {
  const table = useTableApi();

  function onSubmit() {
    table.reload();
  }

  return (
    <>
      <div className={'flex items-center justify-end gap-2'}>
        <TimesheetItemForm value={props.value} onSubmit={onSubmit} asChild>
          <Button variant={'secondary'} size={'sm'} disabled={!props.editable}>
            <PencilIcon />
          </Button>
        </TimesheetItemForm>
      </div>
    </>
  );
}
