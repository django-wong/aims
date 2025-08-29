import { DataTable, useTableApi } from '@/components/data-table-2';
import { Button } from '@/components/ui/button';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { useTable } from '@/hooks/use-table';
import { TimesheetItemForm } from '@/pages/timesheet-items/form';
import { Assignment, Attachment, Timesheet, TimesheetItem, TimesheetReport } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { DownloadIcon, EllipsisVerticalIcon, FileTextIcon, FolderOpenIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import React, { ComponentProps } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { usePagedGetApi } from '@/hooks/use-get-api';
import axios from 'axios';
import { cn, humanFileSize } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTimesheet } from '@/providers/timesheet-provider';
import { TimesheetItemProvider } from '@/providers/timesheet-item-provider';
import { TimesheetItemAttachments } from '@/pages/timesheets/timesheet-item-attachments';

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
      header: 'Hotel',
      cell: ({ row }) => `$${row.original.hotel}`,
    },
    {
      accessorKey: 'rail_or_airfare',
      header: 'Rail/Airfare',
      cell: ({ row }) => `$${row.original.rail_or_airfare}`,
    },
    {
      accessorKey: 'meals',
      header: 'Meals',
      cell: ({ row }) => `$${row.original.meals}`,
    },
    {
      accessorKey: 'other_expenses',
      header: 'Other',
      cell: ({ row }) => `$${row.original.other}`,
    },
    {
      accessorKey: 'attachments',
      header: 'Attachments',
      cell: ({ row }) => (
        <div className={'flex items-center gap-1 justify-start'}>
          <TimesheetItemProvider value={row.original}>
            <TimesheetItemAttachments>
              <Button variant={'secondary'} size={'sm'}>
                <FolderOpenIcon/> <span>({row.original.attachments_count})</span>
              </Button>
            </TimesheetItemAttachments>
          </TimesheetItemProvider>
        </div>
      ),
    }
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
      'include': 'attachments_count',
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
    <>
      <DataTable {...props.datatable} table={table} pagination={false} />
      <div>
        <Accordion type={'multiple'} className={'w-full'} defaultValue={['inspection-report']}>
          <TimesheetReports timesheet={props.timesheet!} type={'inspection-report'} label={'Inspection Report'} />
          <TimesheetReports timesheet={props.timesheet!} type={'punch-list'} label={'Punch List'} />
          <TimesheetReports timesheet={props.timesheet!} type={'hse-report'} label={'HSE Report'} />
        </Accordion>
      </div>
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


interface TimesheetReportsProps {
  timesheet: Timesheet;
  type: string;
  label: string;
}

function TimesheetReports(props: TimesheetReportsProps) {
  const timesheet = useTimesheet();

  const api = usePagedGetApi<TimesheetReport>('/api/v1/timesheet-reports', {
    searchParams: new URLSearchParams({
      'timesheet_id': String(props.timesheet.id),
      'filter[type]': props.type,
      'sort': '-created_at',
      'include': 'attachment',
    })
  });

  function onChange(event:  React.ChangeEvent<HTMLInputElement>) {
    for (const file of (event.target.files || [])) {
      const formData = new FormData();
      formData.append('timesheet_id', String(props.timesheet.id));
      formData.append('type', props.type);
      formData.append('attachment', file);

      axios.post('/api/v1/timesheet-reports', formData).then(() => {
        api.refetch().then(() => {
          console.log('refetched');
        })
      });
    }
  }

  function deleteReport(item: TimesheetReport) {
    axios.delete(`/api/v1/timesheet-reports/${item.id}`).then(() => {
      api.refetch().then(() => {
        console.log('refetched');
      })
    });
  }

  return (
    <>
      <AccordionItem value={props.type}>
        <AccordionTrigger>{props.label} ({(api.data || []).length})</AccordionTrigger>
        <AccordionContent>
          <div className={'flex justify-start gap-4'}>
            {(api.data || []).map((report, index) => (
              <AttachmentItem
                attachment={report.attachment!}
                key={index}
                actions={(
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size={'icon'} variant={'ghost'}>
                        <EllipsisVerticalIcon/>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className={'max-w-56'} align={'start'} side={'right'}>
                      <DropdownMenuLabel>{report.attachment?.name}</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => {window.open(route('attachments.download', { id: report.attachment?.id }))}}>
                        Download
                        <DropdownMenuShortcut>
                          <DownloadIcon/>
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator></DropdownMenuSeparator>
                      <DropdownMenuItem variant={'destructive'} onClick={() => deleteReport(report)}>
                        Delete
                        <DropdownMenuShortcut>
                          <Trash2Icon/>
                        </DropdownMenuShortcut>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              />
            ))}
            {
              timesheet?.status && (timesheet?.status > 0) ? null : (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <AttachmentRoot className={'w-32 bg-secondary/20 aspect-[3/3] border-dashed flex flex-col items-center justify-center hover:bg-background'}>
                      <label>
                        <div>
                          <PlusIcon size={32}/>
                        </div>
                        <input type={'file'} className={'hidden'} onChange={(event) => onChange(event)} />
                      </label>
                    </AttachmentRoot>
                  </TooltipTrigger>
                  <TooltipContent>
                    Upload .xlsx .pdf .docs or image files.
                  </TooltipContent>
                </Tooltip>
              )
            }
          </div>
        </AccordionContent>
      </AccordionItem>
    </>
  );
}

interface AttachmentItemProps {
  attachment: Attachment,
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

export function AttachmentItem(props: AttachmentItemProps) {
  return <AttachmentRoot onClick={() => {window.open(route('attachments.download', { id: props.attachment?.id }))}}>
    <div className={'flex-grow flex items-center justify-center relative'}>
      {
        props.children ?? (<FileTextIcon/>)
      }
      <div className={'top-0 right-0 absolute'} onClick={(event) => { event.stopPropagation(); event.preventDefault(); }}>
        { props.actions }
      </div>
    </div>
    <div className={'flex gap-2 p-2 bg-muted/50 border-t'}>
      <span className={'flex-grow line-clamp-1 truncate'}>
        { props.attachment?.name ?? 'No file name' }
      </span>
    </div>
  </AttachmentRoot>;

}

export function AttachmentRoot(props: React.ComponentProps<'div'>) {
  return <div {...props} className={cn('w-48 h-32 rounded-lg border flex flex-col hover:bg-accent cursor-pointer', props.className)}>
    {props.children}
  </div>;
}
