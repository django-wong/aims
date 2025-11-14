import { DataTable, useTableApi } from '@/components/data-table-2';
import { PopoverConfirm } from '@/components/popover-confirm';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { usePagedGetApi } from '@/hooks/use-get-api';
import { useTable } from '@/hooks/use-table';
import { formatCurrency, formatDate } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { TimesheetReportForm } from '@/pages/assignments/assignment-report-form';
import { TimesheetItemForm } from '@/pages/timesheet-items/form';
import { LogExpenseForm } from '@/pages/timesheet-items/log-expense-form';
import { RejectionDetails } from '@/pages/timesheets/rejection-details';
import { TimesheetItemAttachments } from '@/pages/timesheets/timesheet-item-attachments';
import { TimesheetItemProvider } from '@/providers/timesheet-item-provider';
import { TimesheetReportProvider } from '@/providers/timesheet-report-provider';
import { Assignment, Attachment, Timesheet, TimesheetItem, TimesheetReport } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { DownloadIcon, EllipsisVerticalIcon, FileTextIcon, FolderOpenIcon, PencilIcon, PlusIcon, ReceiptCentIcon, Trash2Icon } from 'lucide-react';
import React, { ComponentProps } from 'react';
import { HideFromClient } from '@/components/hide-from-client';
import { useIsClient } from '@/hooks/use-role';

interface TimesheetItemsProps {
  timesheet?: Timesheet;
  assignment?: Assignment;
  datatable?: Partial<ComponentProps<typeof DataTable>>;
  actions?: (item: TimesheetItem) => React.ReactNode;
}

export function TimesheetItems(props: TimesheetItemsProps) {
  const isClient = useIsClient();
  const columns: ColumnDef<TimesheetItem>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      cell: ({ row }) => formatDate(row.original.date),
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
    // {
    //   accessorKey: 'hourly_rate',
    //   header: () => {
    //     return (
    //       <Tooltip>
    //         <TooltipTrigger>Hourly Rate</TooltipTrigger>
    //         <TooltipContent>The actual hourly rate at the time when inspector log the work.</TooltipContent>
    //       </Tooltip>
    //     )
    //   },
    //   cell: ({ row }) => formatCurrency(row.original.hourly_rate),
    // },
    {
      accessorKey: 'days',
      header: 'Overnights',
      cell: ({ row }) => `${row.original.overnights}`,
    },
    {
      accessorKey: 'travel_distance',
      header: 'Travel Distance',
      cell: ({ row }) => row.original.travel_distance,
    },
    // {
    //   accessorKey: 'travel_rate',
    //   header: 'Travel Rate',
    //   cell: ({ row }) => formatCurrency(row.original.travel_rate),
    // },
    {
      accessorKey: 'expenses',
      header: 'Hotel',
      cell: ({ row }) => formatCurrency(row.original.expenses_by_type?.accommodation ?? 0),
    },
    {
      accessorKey: 'rail_or_airfare',
      header: 'Rail/Airfare',
      cell: ({ row }) => formatCurrency(row.original.expenses_by_type?.travel ?? 0),
    },
    {
      accessorKey: 'meals',
      header: 'Meals',
      cell: ({ row }) => formatCurrency(row.original.expenses_by_type?.meals ?? 0),
    },
    {
      accessorKey: 'other_expenses',
      header: 'Other',
      cell: ({ row }) => formatCurrency(row.original.expenses_by_type?.other ?? 0),
    },
    {
      accessorKey: 'attachments',
      header: 'Attachments',
      cell: ({ row }) => (
        <div className={'flex items-center justify-start gap-1'}>
          <TimesheetItemProvider value={row.original}>
            <TimesheetItemAttachments onUploadComplete={table.reload}>
              <Button variant={'secondary'} size={'sm'}>
                <FolderOpenIcon /> <span>({row.original.attachments_count})</span>
              </Button>
            </TimesheetItemAttachments>
          </TimesheetItemProvider>
        </div>
      ),
    },
    ...(isClient ? [] : [
      {
        accessorKey: 'actions',
        header: () => <TableCellWrapper last>Actions</TableCellWrapper>,
        size: 150,
        enablePinning: true,
        cell: ({ row }) => {
          return (
            <TableCellWrapper last>
              <TimesheetItemActions value={row.original} />
            </TableCellWrapper>
          );
        },
      } as ColumnDef<TimesheetItem>
    ])
  ];

  const table = useTable<TimesheetItem>('/api/v1/timesheet-items', {
    selectable: false,
    defaultParams: {
      'filter[timesheet_id]': String(props.timesheet?.id ?? ''),
      'filter[assignment_id]': String(props.assignment?.id ?? ''),
      include: 'attachments_count',
      sort: '-date',
    },
    initialState: {
      columnPinning: {
        left: ['date'],
        right: ['actions'],
      },
      pagination: {
        pageSize: 99,
      },
    },
    columns: columns,
  });

  return (
    <div className={'flex flex-col gap-6'}>
      <RejectionDetails />
      <DataTable {...props.datatable} table={table} pagination={false} />
      <div>
        <Accordion type={'multiple'} className={'w-full'} defaultValue={['inspection-report']}>
          <TimesheetReports timesheet={props.timesheet!} type={'inspection-report'} label={'Inspection Report'} />
          <TimesheetReports timesheet={props.timesheet!} type={'punch-list'} label={'Punch List'} />
          <TimesheetReports timesheet={props.timesheet!} type={'hse-report'} label={'HSE Report'} />
        </Accordion>
      </div>
    </div>
  );
}

interface TimesheetItemActionsProps {
  value: TimesheetItem;
}

export function TimesheetItemActions(props: TimesheetItemActionsProps) {
  const table = useTableApi();

  function onSubmit() {
    table.reload();
  }

  function deleteItem() {
    axios.delete(`/api/v1/timesheet-items/${props.value.id}`).then(() => {
      table.reload();
    });
  }

  return (
    <TimesheetItemProvider value={props.value}>
      <div className={'flex items-center justify-end gap-2'}>
        <HideFromClient>
          <LogExpenseForm
            onSubmit={() => {
              table.reload();
            }}
          >
            <Button variant={'outline'} size={'sm'}>
              <ReceiptCentIcon />
            </Button>
          </LogExpenseForm>
        </HideFromClient>
        <HideFromClient>
          <TimesheetItemForm value={props.value} onSubmit={onSubmit} asChild>
            <Button variant={'outline'} size={'sm'}>
              <PencilIcon />
            </Button>
          </TimesheetItemForm>
        </HideFromClient>
        <HideFromClient>
          <PopoverConfirm message={'Are you sure to delete this record?'} asChild onConfirm={deleteItem}>
            <Button variant={'destructive'} size={'sm'}>
              <Trash2Icon />
            </Button>
          </PopoverConfirm>
        </HideFromClient>
      </div>
    </TimesheetItemProvider>
  );
}

interface TimesheetReportsProps {
  timesheet: Timesheet;
  type: string;
  label: string;
}

function TimesheetReports(props: TimesheetReportsProps) {
  const api = usePagedGetApi<TimesheetReport>('/api/v1/timesheet-reports', {
    searchParams: new URLSearchParams({
      timesheet_id: String(props.timesheet.id),
      'filter[type]': props.type,
      sort: '-created_at',
      include: 'attachment',
    }),
  });

  const isClient = useIsClient();
  const can_add = !isClient;
  const can_add_more = can_add && (props.type === 'inspection-report' ? (api.data || []).length < 1 : true);

  function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    for (const file of event.target.files || []) {
      const formData = new FormData();
      formData.append('timesheet_id', String(props.timesheet.id));
      formData.append('type', props.type);
      formData.append('attachment', file);

      axios.post('/api/v1/timesheet-reports', formData).then(() => {
        api.refetch().then(() => {
          console.log('refetched');
        });
      });
    }
  }

  function deleteReport(item: TimesheetReport) {
    axios.delete(`/api/v1/timesheet-reports/${item.id}`).then(() => {
      api.refetch().then(() => {
        console.log('refetched');
      });
    });
  }

  return (
    <>
      <AccordionItem value={props.type}>
        <AccordionTrigger>
          {props.label} ({(api.data || []).length})
        </AccordionTrigger>
        <AccordionContent>
          <div className={'flex justify-start gap-4'}>
            {(api.data || []).map((report, index) => (
              <TimesheetReportProvider value={report} key={index}>
                <AttachmentItem
                  attachment={report.attachment!}
                  key={index}
                  actions={
                    <>
                      <TimesheetReportForm value={report} onSubmit={() => {}}>
                        <Button size={'sm'} variant={'ghost'}>
                          <PencilIcon />
                        </Button>
                      </TimesheetReportForm>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size={'sm'} variant={'ghost'}>
                            <EllipsisVerticalIcon />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className={'w-56'} align={'start'} side={'right'}>
                          <DropdownMenuLabel>{report.attachment?.name}</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => {
                              window.open(route('attachments.download', { id: report.attachment?.id }));
                            }}
                          >
                            Download
                            <DropdownMenuShortcut>
                              <DownloadIcon />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator></DropdownMenuSeparator>
                          <DropdownMenuItem variant={'destructive'} onClick={() => deleteReport(report)}>
                            Delete
                            <DropdownMenuShortcut>
                              <Trash2Icon />
                            </DropdownMenuShortcut>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </>
                  }
                />
              </TimesheetReportProvider>
            ))}

            {can_add_more ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <label>
                    <AttachmentRoot className={'bg-secondary hover:bg-background flex flex-col items-center justify-center border-dashed'}>
                      <div>
                        <PlusIcon size={32} />
                      </div>
                      <input type={'file'} className={'hidden'} onChange={(event) => onChange(event)} />
                    </AttachmentRoot>
                  </label>
                </TooltipTrigger>
                <TooltipContent>Upload .xlsx .pdf .docs or image files.</TooltipContent>
              </Tooltip>
            ) : null}
          </div>
        </AccordionContent>
      </AccordionItem>
    </>
  );
}

interface AttachmentItemProps {
  attachment: Attachment;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

export function AttachmentItem(props: AttachmentItemProps) {
  return (
    <AttachmentRoot>
      <div className={'relative flex flex-grow items-center justify-center'}>
        {props.children ?? <FileTextIcon size={48} />}
        <div className={'absolute top-2 right-2 flex gap-1'}>{props.actions}</div>
      </div>
      <div className={'bg-muted/50 flex gap-2 border-t p-2'}>
        <span className={'line-clamp-1 flex-grow truncate'}>{props.attachment?.name ?? 'No file name'}</span>
      </div>
    </AttachmentRoot>
  );
}

export function AttachmentRoot(props: React.ComponentProps<'div'>) {
  return (
    <div {...props} className={cn('hover:bg-accent/30 flex h-48 w-48 cursor-pointer flex-col rounded-lg border', props.className)}>
      {props.children}
    </div>
  );
}
