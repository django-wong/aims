import { ColumnToggle, DataTable, TableRefresher } from '@/components/data-table-2';
import { DialogInnerContent } from '@/components/dialog-inner-content';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
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
import { useIsClient } from '@/hooks/use-role';
import { useTable } from '@/hooks/use-table';
import { cn, timesheet_range } from '@/lib/utils';
import { TimesheetStatus } from '@/pages/timesheets/status';
import { AssignmentProvider, useAssignment } from '@/providers/assignment-provider';
import { TimesheetProvider } from '@/providers/timesheet-provider';
import { Assignment, Timesheet } from '@/types';
import { Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { EllipsisVerticalIcon, PenIcon } from 'lucide-react';
import { startTransition, useState } from 'react';
import { ClientApprove } from '../timesheets/client-approve';
import { ContractorHolderApprove } from '@/pages/timesheets/contractor-holder-approve';
import { CoordinationOfficeApprove } from '@/pages/timesheets/coordination-office-approve';
import { TimesheetEditContent } from '@/pages/timesheets/edit';

interface TimesheetsProps {
  assignment?: Assignment;
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

export function Timesheets(props: TimesheetsProps) {
  const [timesheet, setTimesheet] = useState<Timesheet | null>();
  const assignment = useAssignment();
  const isClient = useIsClient();

  const columns: ColumnDef<Timesheet>[] = [
    ...(isClient ? [assignment_column] : []),
    {
      accessorKey: 'inspector',
      header: 'Inspector',
      cell: ({ row }) => <Link className={'underline'} href={route('timesheets.edit', row.original.id)}>{row.original.user?.name}</Link>,
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
      cell: ({ row }) => <span>{row.getValue('travel_distance')} {row.original.mileage_unit}</span>,
    },
    {
      accessorKey: 'cost',
      header: 'Cost',
      cell: ({ row }) => <span>${row.getValue('cost')}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) =>
        <span className={cn('timesheet-status', `timesheet-status-${row.original.status}`)}>
          <TimesheetProvider value={row.original}>
            <TimesheetStatus status={row.original.status} />
          </TimesheetProvider>
        </span>
    },
    {
      accessorKey: 'actions',
      header: () => {
        return <div className={'flex items-center justify-end'}>Actions</div>;
      },
      cell: ({ row }) => (
        <AssignmentProvider value={row.original.assignment || props.assignment || assignment}>
          <div className={'flex items-center justify-end'}>
            <TimesheetActions timesheet={row.original} onViewDetailsClick={setTimesheet} />
          </div>
        </AssignmentProvider>
      ),
    },
  ];

  const table = useTable<Timesheet>('/api/v1/timesheets', {
    columns,
    defaultParams: {
      ...props.filters,
      ...(props.assignment
        ? {
            'filter[assignment_id]': String(props.assignment?.id),
          }
        : null),
      include: 'user,assignment',
      sort: '-start',
    },
  });

  function approve() {
    if (timesheet) {
      axios.post(`/api/v1/timesheets/${timesheet.id}/approve`).then(() => {
        startTransition(() => {
          table.reload();
          setTimesheet(null);
        });
      });
    }
  }

  return (
    <>
      <DataTable left={<ColumnToggle />} right={<TableRefresher />} table={table} />
      <Dialog
        open={!!timesheet}
        onOpenChange={(open) => {
          if (!open) {
            setTimesheet(null);
          }
        }}
      >
        <DialogContent className={'sm:max-w-5xl'}>
          <DialogHeader>
            <DialogTitle>Timesheet Details</DialogTitle>
            <DialogDescription>Reviewing timesheet items for the period of {timesheet ? timesheet_range(timesheet) : 'N/A'}.</DialogDescription>
          </DialogHeader>
          <DialogInnerContent>
            {timesheet ? (
              <TimesheetProvider value={timesheet}>
                <TimesheetEditContent/>
              </TimesheetProvider>
            ) : null}
          </DialogInnerContent>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant={'outline'}>Close</Button>
            </DialogClose>
            <Button onClick={approve}>Approve</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface TimesheetActionsProps {
  timesheet: Timesheet;
  onViewDetailsClick?: (item: Timesheet) => void;
}

function TimesheetActions(props: TimesheetActionsProps) {
  return (
    <div className={'flex items-center space-x-2'}>

      <TimesheetProvider value={props.timesheet}>
        <ClientApprove/>
        <ContractorHolderApprove/>
        <CoordinationOfficeApprove/>
      </TimesheetProvider>

      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(event) => event.stopPropagation()} className={'cursor-pointer'}>
          <Button variant={'secondary'} size={'sm'}>
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align={'end'} side={'bottom'}>
          <DropdownMenuLabel>
            <div className={'flex items-center justify-between'}>
              <span>Timesheet</span>
              <span>#{props.timesheet.id}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => props.onViewDetailsClick?.(props.timesheet)}>
              View Details
              <DropdownMenuShortcut>
                <PenIcon />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
