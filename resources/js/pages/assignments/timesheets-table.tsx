import { ColumnToggle, DataTable, TableRefresher } from '@/components/data-table-2';
import { useIsClient } from '@/hooks/use-role';
import { useTable } from '@/hooks/use-table';
import { cn, timesheet_range } from '@/lib/utils';
import { TimesheetStatus } from '@/pages/timesheets/status';
import { AssignmentProvider } from '@/providers/assignment-provider';
import { TimesheetProvider } from '@/providers/timesheet-provider';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

import { CreateInvoiceButton } from '@/pages/assignments/create-invoice-button';
import { Timesheet } from '@/types';
import { TimesheetActions } from '@/pages/timesheets';
import { StateFilter } from '@/pages/timesheets/state-filter';
import { useTableConfiguration } from '@/providers/table-configuration';

interface TimesheetsProps {
  filters?: Record<string, any>;
}

const assignment_column: ColumnDef<Timesheet> = {
  accessorKey: 'assignment',
  header: 'Assignment',
  cell: ({ row }) => (
    <Link className={'underline'} href={route('assignments.edit', row.original.assignment_id)}>
      {row.original.assignment?.reference_number}
    </Link>
  ),
};

export function TimesheetsTable(props: TimesheetsProps) {
  const config = useTableConfiguration();
  const isClient = useIsClient();

  const columns: ColumnDef<Timesheet>[] = [
    ...(isClient ? [assignment_column] : []),
    {
      accessorKey: 'id',
      header: '#',
      cell: ({ row }) => <Link className={'underline'} href={route('timesheets.edit', row.original.id)}>{row.original.id}</Link>,
    },
    {
      accessorKey: 'inspector',
      header: 'Inspector',
      cell: ({ row }) => <>{row.original.user?.name}</>,
    },
    {
      accessorKey: 'range',
      header: 'Range (DD/MM/YYYY)',
      cell: ({ row }) => <span>{timesheet_range(row.original)}</span>,
    },
    {
      accessorKey: 'hours',
      header: 'Hours',
      cell: ({ row }) => <span>{row.getValue('hours')}</span>,
    },
    {
      accessorKey: 'travel_distance',
      header: 'Travel Distance',
      cell: ({ row }) => <span>{row.getValue('travel_distance')} {row.original.travel_unit}</span>,
    },
    {
      accessorKey: 'expenses',
      header: 'Expenses',
      cell: ({ row }) => <span>${row.getValue('expenses')}</span>,
    },
    {
      accessorKey: 'cost',
      header: 'Total Cost',
      cell: ({ row }) => <span>${row.getValue('cost')}</span>,
    },
    {
      accessorKey: 'client_invoice_id',
      header: 'Client Invoice',
      cell: ({ row }) => {
        if (row.original.client_invoice_id) {
          return (
            <Link className={'link'} href={route('invoices.edit', row.original.client_invoice_id)}>#{row.original.client_invoice_id}</Link>
          );
        }
        return '';
      },
    },
    {
      accessorKey: 'contractor_invoice_id',
      header: 'Invoice',
      cell: ({ row }) => {
        if (row.original.contractor_invoice_id) {
          return (
            <Link className={'link'} href={route('invoices.edit', row.original.contractor_invoice_id)}>#{row.original.contractor_invoice_id}</Link>
          );
        }
        return '';
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) =>
        <span className={cn('timesheet-status', `timesheet-status-${row.original.status}`)}>
          <TimesheetProvider value={row.original}>
            <TimesheetStatus />
          </TimesheetProvider>
        </span>
    },
    {
      accessorKey: 'actions',
      header: () => {
        return <div className={'flex items-center justify-end'}>Actions</div>;
      },
      enablePinning: true,
      cell: ({ row }) => (
        <AssignmentProvider value={row.original.assignment ?? null}>
          <TimesheetProvider value={row.original}>
            <TimesheetActions/>
          </TimesheetProvider>
        </AssignmentProvider>
      ),
    },
  ];

  const table = useTable<Timesheet>('/api/v1/timesheets', {
    selectable: !isClient,
    columns,
    initialState: {
      columnPinning: {
        right: [
          'actions'
        ]
      }
    },
    defaultParams: {
      ...props.filters,
      include: 'user,assignment',
      sort: '-start',
    },
  });

  return (
    <>
      <DataTable
        left={
          config.toolbar ? (
            <>
              <CreateInvoiceButton/>
              <ColumnToggle />
              <TableRefresher />
              <><StateFilter/></>
            </>
          ) : null
        }
        table={table}
      />
    </>
  );
}
