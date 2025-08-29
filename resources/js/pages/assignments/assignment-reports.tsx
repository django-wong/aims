import { useTable } from '@/hooks/use-table';
import { DataTable, useTableApi } from '@/components/data-table-2';
import { DialogFormProps, TimesheetReport } from '@/types';
import dayjs from 'dayjs';
import { useAssignment } from '@/providers/assignment-provider';
import { Badge } from '@/components/ui/badge';
import { TimesheetReportProvider, useTimesheetReport } from '@/providers/timesheet-report-provider';
import { Button } from '@/components/ui/button';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { PencilIcon } from 'lucide-react';
import { DialogWrapper } from '@/components/dialog-wrapper';
import { useReactiveForm, useResource } from '@/hooks/use-form';
import { Form, FormField } from '@/components/ui/form';
import { VFormField } from '@/components/vform';
import { z } from 'zod';
import { useTimesheet } from '@/providers/timesheet-provider';
import { DialogClose } from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { DatePicker } from '@/components/date-picker';
import { toFormData } from 'axios';

export function AssignmentReports() {
  const assignment = useAssignment();

  const table = useTable<TimesheetReport>(`/api/v1/assignments/${assignment!.id}/timesheet-reports`, {
    columns: [
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
          return <Badge variant={'secondary'}>{describe_report_type(row.getValue('type') as string)}</Badge>;
        }
      },
      {
        accessorKey: 'attachment',
        header: 'File',
        cell: ({ row }) => {
          const attachment = row.original.attachment;
          if (attachment) {
            return (
              <a href={route('attachments.download', attachment.id)} target={'_blank'} rel={'noreferrer'}>
                { attachment.name}
              </a>
            );
          }
          return '-';
        }
      },
      {
        accessorKey: 'doc_no',
        header: 'Doc No',
      },
      {
        accessorKey: 'rev',
        header: 'Rev',
      },
      {
        accessorKey: 'rev_date',
        header: 'Rev Date',
        cell: ({ row }) => {
          const date = row.getValue('rev_date') as string;
          return date ? dayjs(date).format('DD/MM/YYYY') : '-';
        },
      },
      {
        accessorKey: 'visit_date',
        header: 'Visit Date',
        cell: ({ row }) => {
          const date = row.getValue('visit_date') as string;
          return date ? dayjs(date).format('DD/MM/YYYY') : '-';
        },
      },
      {
        accessorKey: 'report_no',
        header: 'Report No',
      },
      {
        accessorKey: 'vendor_id',
        header: 'Vendor',
        cell: ({ row }) => {
          // This would need to be populated with vendor name from the relationship
          const vendorId = row.getValue('vendor_id') as number;
          return vendorId ? `Vendor ${vendorId}` : '-';
        },
      },
      {
        accessorKey: 'raised_by',
        header: 'Raised By',
      },
      {
        accessorKey: 'closed_or_rev_by_id',
        header: 'Closed/Rev By',
        cell: ({ row }) => {
          return row.original.closed_or_rev_by?.name;
        },
      },
      {
        accessorKey: 'closed_date',
        header: 'Closed Date',
        cell: ({ row }) => {
          const date = row.getValue('closed_date') as string;
          return date ? dayjs(date).format('DD/MM/YYYY') : '-';
        },
      },
      {
        accessorKey: 'is_closed',
        header: 'Status',
        cell: ({ row }) => {
          const isClosed = row.getValue('is_closed') as boolean;
          return (
            <Badge variant={isClosed ? 'outline' : 'default'}>
              {isClosed ? 'Closed' : 'Open'}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'actions',
        header: () => {
          return <TableCellWrapper last>Actions</TableCellWrapper>
        },
        cell: ({ row }) => {
          return <TimesheetReportProvider value={row.original}><ReportActions/></TimesheetReportProvider>
        }
      }
    ]
  });

  return (
    <>
      <DataTable table={table}/>
    </>
  );
}

export function describe_report_type(type: string) {
  switch (type) {
    case 'inspection-report':
      return 'IR';
    case 'punch-list':
      return 'PL';
    case 'hse-report':
      return 'HSE';
    default:
      return 'NCR';
  }
}


export function ReportActions() {
  const table = useTableApi();
  const report = useTimesheetReport();

  if (! report) {
    return null;
  }

  return (
    <div className={'flex items-center gap-2 justify-end'}>
      <TimesheetReportForm value={report} onSubmit={table.reload}>
        <Button variant={'ghost'} size={'sm'}>
          <PencilIcon/>
        </Button>
      </TimesheetReportForm>
    </div>
  );
}

const schema = z.object({
  timesheet_id: z.number().optional(),
  type: z.string().optional(),
  doc_no: z.string().optional().nullable(),
  rev: z.string().optional().nullable(),
  attachment: z.file().optional().nullable(),
  visit_date: z.string().optional().nullable(),
  report_no: z.string().optional().nullable(),
  vendor_id: z.number().optional().nullable(),
  raised_by: z.string().optional().nullable(),
  rev_date: z.string().optional().nullable(),
  is_closed: z.coerce.number().optional(),
})

export function TimesheetReportForm(props: DialogFormProps & {type?: string}) {
  const timesheet = useTimesheet();

  const form = useReactiveForm<z.infer<typeof schema>, TimesheetReport>({
    ...useResource('/api/v1/timesheet-reports', {
      timesheet_id: timesheet?.id,
      type: props.type,
      ...props.value
    }),
    serialize: (data) => {
      return toFormData(data);
    },
    resolver: zodResolver(schema) as any
  });

  function save() {
    form.handleSubmit(() => {
      form.submit().then((response) => {
        if (response) {
          props.onSubmit(response.data as TimesheetReport);
        }
      });
    })();
  }

  const footer = (
    <>
      <DialogClose>Close</DialogClose>
      <Button onClick={save}>Save</Button>
    </>
  );

  return (
    <>
      <DialogWrapper footer={footer} trigger={props.children} title={'Report'} description={'Manage timesheet report'}>
        <Form {...form}>
          <div className={'grid grid-cols-12 gap-4'}>

            {
              props.value ? null : (
                <div className="col-span-12">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <VFormField label="Report Type">
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <SelectTrigger className={'w-full'}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inspection-report">Inspection Report (IR)</SelectItem>
                            <SelectItem value="punch-list">Punch List (PL)</SelectItem>
                            <SelectItem value="hse-report">HSE Report (HSE)</SelectItem>
                            <SelectItem value="ncr">Non-Conformance Report (NCR)</SelectItem>
                          </SelectContent>
                        </Select>
                      </VFormField>
                    )}
                  />
                </div>
              )
            }

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="doc_no"
                render={({ field }) => (
                  <VFormField label="Document Number">
                    <Input {...field} value={field.value || ''} />
                  </VFormField>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="report_no"
                render={({ field }) => (
                  <VFormField label="Report Number">
                    <Input {...field} value={field.value || ''} />
                  </VFormField>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="rev"
                render={({ field }) => (
                  <VFormField label="Revision">
                    <Input {...field} value={field.value || ''} />
                  </VFormField>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="rev_date"
                render={({ field }) => (
                  <VFormField label="Revision Date">
                    <DatePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => field.onChange(date ? dayjs(date).format('YYYY-MM-DD') : null)}
                    />
                  </VFormField>
                )}
              />
            </div>

            <div className="col-span-6">
              <FormField
                control={form.control}
                name="visit_date"
                render={({ field }) => (
                  <VFormField label="Visit Date">
                    <DatePicker
                      value={field.value ? new Date(field.value) : undefined}
                      onChange={(date) => field.onChange(date ? dayjs(date).format('YYYY-MM-DD') : null)}
                    />
                  </VFormField>
                )}
              />
            </div>

            <div className="col-span-12">
              <FormField
                control={form.control}
                name="raised_by"
                render={({ field }) => (
                  <VFormField label="Raised By">
                    <Input {...field} value={field.value || ''} />
                  </VFormField>
                )}
              />
            </div>

            <div className="col-span-12">
              <FormField
                control={form.control}
                name="attachment"
                render={({ field }) => (
                  <VFormField label="Attachment / Reversion File">
                    <Input type="file" onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)} />
                  </VFormField>
                )}
              />
            </div>

            <div className="col-span-12">
              <FormField
                control={form.control}
                name="is_closed"
                render={({ field }) => (
                  <VFormField
                    label="Report Status"
                    description="Mark this report as closed when completed"
                    className="flex flex-row items-center justify-between rounded-lg border p-4"
                  >
                    <Switch checked={!!field.value} onCheckedChange={field.onChange}/>
                  </VFormField>
                )}
              />
            </div>
          </div>
        </Form>
      </DialogWrapper>
    </>
  )
}
