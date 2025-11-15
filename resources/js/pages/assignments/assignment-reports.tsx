import { DataTable, useTableApi } from '@/components/data-table-2';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { useTable } from '@/hooks/use-table';
import { useAssignment } from '@/providers/assignment-provider';
import { TimesheetReportProvider, useTimesheetReport } from '@/providers/timesheet-report-provider';
import { TimesheetReport } from '@/types';
import dayjs from 'dayjs';
import { PencilIcon } from 'lucide-react';
import { TimesheetReportForm } from '@/pages/assignments/assignment-report-form';

export function AssignmentReports() {
  const assignment = useAssignment();

  const table = useTable<TimesheetReport>(`/api/v1/assignments/${assignment!.id}/timesheet-reports`, {
    columns: [
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
          return <Badge variant={'secondary'}>{describe_report_type(row.getValue('type') as string)}</Badge>;
        },
      },
      {
        accessorKey: 'attachment',
        header: 'File',
        cell: ({ row }) => {
          const attachment = row.original.attachment;
          if (attachment) {
            return (
              <a href={route('attachments.download', attachment.id)} target={'_blank'} rel={'noreferrer'}>
                {attachment.name}
              </a>
            );
          }
          return '-';
        },
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
          return <Badge variant={isClosed ? 'outline' : 'default'}>{isClosed ? 'Closed' : 'Open'}</Badge>;
        },
      },
      {
        accessorKey: 'actions',
        header: () => {
          return <TableCellWrapper last>Actions</TableCellWrapper>;
        },
        cell: ({ row }) => {
          return (
            <TimesheetReportProvider value={row.original}>
              <ReportActions />
            </TimesheetReportProvider>
          );
        },
      },
    ],
  });

  return (
    <>
      <DataTable table={table} />
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
    case 'inspection-release-note':
      return 'IRN';
    default:
      return 'NCR';
  }
}

export function ReportActions() {
  const table = useTableApi();
  const report = useTimesheetReport();

  if (!report) {
    return null;
  }

  return (
    <div className={'flex items-center justify-end gap-2'}>
      <TimesheetReportForm value={report} onSubmit={table.reload}>
        <Button variant={'ghost'} size={'sm'}>
          <PencilIcon />
        </Button>
      </TimesheetReportForm>
    </div>
  );
}



