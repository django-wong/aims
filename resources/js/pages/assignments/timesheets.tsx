import { ColumnToggle, DataTable, TableRefresher, useTableApi } from '@/components/data-table-2';
import { DialogInnerContent } from '@/components/dialog-inner-content';
import { Badge } from '@/components/ui/badge';
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
import { useTable } from '@/hooks/use-table';
import { describe_timesheet_status, timesheet_range } from '@/lib/utils';
import { TimesheetItems } from '@/pages/timesheets/timesheet-items';
import { Assignment, Timesheet } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { CheckIcon, EllipsisVerticalIcon, PenIcon } from 'lucide-react';
import { startTransition, useDeferredValue, useState } from 'react';
import axios from 'axios';
import { TimesheetProvider } from '@/providers/timesheet-provider';
import { TimesheetStatus } from '@/pages/timesheets/status';

interface TimesheetsProps {
  assignment?: Assignment;
  filters?: Record<string, any>
}

export function Timesheets(props: TimesheetsProps) {
  const [timesheet, setTimesheet] = useState<Timesheet | null>();
  const deferred_timesheet = useDeferredValue(timesheet);
  const columns: ColumnDef<Timesheet>[] = [
    // range, hours, travel_distance, cost, status
    {
      accessorKey: 'inspector',
      header: 'Inspector',
      cell: ({ row }) => <span>{row.original.user?.name}</span>
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
      cell: ({ row }) => <span>{row.getValue('travel_distance')}</span>,
    },
    {
      accessorKey: 'cost',
      header: 'Cost',
      cell: ({ row }) => <span>${row.getValue('cost')}</span>,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <TimesheetStatus status={row.original.status} />
      )
    },
    {
      accessorKey: 'actions',
      header: () => {
        return <div className={'flex items-center justify-end'}>Actions</div>;
      },
      cell: ({ row }) => (
        <div className={'flex items-center justify-end'}>
          <TimesheetActions timesheet={row.original} onViewDetailsClick={setTimesheet} />
        </div>
      ),
    },
  ];

  const table = useTable<Timesheet>('/api/v1/timesheets', {
    columns,
    defaultParams: {
      ...props.filters,
      ...(
        props.assignment ? {
          'filter[assignment_id]': String(props.assignment?.id),
        } : null
      ),
      'include': 'user',
      sort: '-start',
    },
  });

  function approve() {
    if (timesheet) {
      axios.post(`/api/v1/timesheets/${timesheet.id}/approve`).then(() => {
        startTransition(() => {
          table.reload();
          setTimesheet(null);
        })
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
            <DialogTitle>Timesheet Items</DialogTitle>
            <DialogDescription>Reviewing timesheet items for the period of {timesheet ? timesheet_range(timesheet) : 'N/A'}.</DialogDescription>
          </DialogHeader>
          <DialogInnerContent>
            {
              timesheet ? (
                <TimesheetProvider value={timesheet}>
                  <TimesheetItems
                    timesheet={timesheet || deferred_timesheet!}
                  />
                </TimesheetProvider>
              ) : null
            }
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
  const table = useTableApi();

  function approve() {
    axios.post(`/api/v1/timesheets/${props.timesheet.id}/approve`).then(() => {
      table.reload();
    });
  }

  // function request_revise() {
  //   axios.post(`/api/v1/timesheets/${props.timesheet.id}/request-revise`).then(() => {
  //     table.reload();
  //   });
  // }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(event) => event.stopPropagation()} className={'cursor-pointer'}>
          <Button variant={'secondary'}>
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
          { props.timesheet.status > 0 ? (
            <DropdownMenuGroup>
              <DropdownMenuItem variant={'default'} onClick={approve}>
                Approve
                <DropdownMenuShortcut>
                  <CheckIcon />
                </DropdownMenuShortcut>
              </DropdownMenuItem>
              {/*<DropdownMenuItem variant={'destructive'} onClick={request_revise}>*/}
              {/*  Request Revise*/}
              {/*  <DropdownMenuShortcut>*/}
              {/*    <XIcon />*/}
              {/*  </DropdownMenuShortcut>*/}
              {/*</DropdownMenuItem>*/}
            </DropdownMenuGroup>
          ) : null }
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
    </>
  );
}
