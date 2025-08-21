import { ColumnToggle, DataTable, TableRefresher } from '@/components/data-table-2';
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
import { CheckIcon, EllipsisVerticalIcon, PenIcon, PlusIcon, XIcon } from 'lucide-react';
import { useState } from 'react';
import { TimesheetItemForm } from '@/pages/timesheet-items/form';

interface TimesheetsProps {
  assignment: Assignment;
}

export function Timesheets(props: TimesheetsProps) {
  const [timesheet, setTimesheet] = useState<Timesheet | null>();

  const columns: ColumnDef<Timesheet>[] = [
    // range, hours, travel_distance, cost, status
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
      header: () => {
        return <div className={'flex items-center justify-end'}>Status / Actions</div>;
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
      'filter[assignment_id]': String(props.assignment.id),
      sort: '-start',
    },
  });


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
          <TimesheetItems
            timesheet={timesheet!}
          />
          <div className={'h-1'}></div>
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
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(event) => event.stopPropagation()} className={'cursor-pointer'}>
          <Badge variant={'secondary'}>
            {describe_timesheet_status(props.timesheet.status)}
            <EllipsisVerticalIcon />
          </Badge>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align={'end'} side={'bottom'}>
          <DropdownMenuLabel>
            <div className={'flex items-center justify-between'}>
              <span>Timesheet</span>
              <span>#{props.timesheet.id}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem variant={'default'}>
              Approve
              <DropdownMenuShortcut>
                <CheckIcon />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem variant={'destructive'} onClick={() => {}}>
              Request Revise
              <DropdownMenuShortcut>
                <XIcon />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
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
