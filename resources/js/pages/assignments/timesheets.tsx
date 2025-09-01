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
import { timesheet_range } from '@/lib/utils';
import { TimesheetItems } from '@/pages/timesheets/timesheet-items';
import { Assignment, Timesheet } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { CheckIcon, EllipsisVerticalIcon, PenIcon } from 'lucide-react';
import { startTransition, useDeferredValue, useState } from 'react';
import axios from 'axios';
import { TimesheetProvider } from '@/providers/timesheet-provider';
import { TimesheetStatus } from '@/pages/timesheets/status';
import { AssignmentProvider, useAssignment } from '@/providers/assignment-provider';
import { useOrg } from '@/hooks/use-org';
import { useIsClient } from '@/hooks/use-role';
import { Link } from '@inertiajs/react';

interface TimesheetsProps {
  assignment?: Assignment;
  filters?: Record<string, any>
}

export function Timesheets(props: TimesheetsProps) {
  const [timesheet, setTimesheet] = useState<Timesheet | null>();
  const deferred_timesheet = useDeferredValue(timesheet);
  const assignment = useAssignment();
  const isClient = useIsClient();

  const columns: ColumnDef<Timesheet>[] = [
    // range, hours, travel_distance, cost, status
    ...(isClient
      ? [
          {
            accessorKey: 'assignment',
            header: 'Assignment',
            cell: ({ row }) => <Link className={'underline'} href={route('assignments.edit', row.original.assignment_id)}>{row.original.assignment?.reference_number}</Link>,
          },
        ]
      : []),
    {
      accessorKey: 'inspector',
      header: 'Inspector',
      cell: ({ row }) => <span>{row.original.user?.name}</span>,
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
      cell: ({ row }) => <TimesheetStatus status={row.original.status} />,
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
      ...(
        props.assignment ? {
          'filter[assignment_id]': String(props.assignment?.id),
        } : null
      ),
      'include': 'user,assignment',
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
  const assignment = useAssignment();
  const table = useTableApi();
  const org = useOrg();
  const isClient = useIsClient();

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

  let need_approval = false;

  if (org?.id === assignment!.operation_org_id) {
    if ([1].indexOf(props.timesheet!.status) != -1) {
      need_approval = true;
    }
  }

  if (org?.id === assignment!.org_id) {
    if (isClient) {
      if ([3].indexOf(props.timesheet!.status) != -1) {
        need_approval = true;
      }
    } else {
      if ([1, 2].indexOf(props.timesheet!.status) != -1) {
        need_approval = true;
      }
    }
  }


  return (
    <div className={'flex items-center space-x-2'}>
      { need_approval ? (
        <Button variant={'secondary'} onClick={approve} size={'sm'}>
          <CheckIcon />
          Approve
        </Button>
      ) : null }

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
