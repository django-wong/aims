import { DataTable } from '@/components/data-table-2';
import { useTable } from '@/hooks/use-table';
import Layout from '@/layouts/app-layout';
import { describeTimesheetIssue } from '@/pages/timesheets/issue';
import { BreadcrumbItem, LateReport } from '@/types';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Reports Late',
    href: '.',
  },
];

export default function ReportsLatePage() {
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Head title="reports-late" />
      <div className={'px-6'}>
        <ReportsLateTable />
      </div>
    </Layout>
  );
}

export function ReportsLateTable() {
  const table = useTable('/api/v1/reports/late-reports', {
    columns,
  });
  return <DataTable table={table} />;
}

const columns: ColumnDef<LateReport>[] = [
  {
    accessorKey: 'reference_number',
    header: 'Reference Number',
  },
  {
    accessorKey: 'week',
    header: 'Week',
  },
  {
    accessorKey: 'org_name',
    header: 'Office',
  },
  {
    accessorKey: 'operation_org_name',
    header: 'Coordinating Office',
  },
  {
    accessorKey: 'inspector_name',
    header: 'Inspector Name',
  },
  {
    accessorKey: 'report_required',
    header: 'Report Required',
    cell: ({ getValue }) => (getValue<number>() === 1 ? 'Yes' : 'No'),
  },
  {
    accessorKey: 'issue_code',
    header: 'Issue Code',
    size: 100,
    cell: ({ getValue }) => {
      return describeTimesheetIssue(getValue<number>());
    },
  },
  {
    accessorKey: 'earliest_visit_date',
    header: 'Earliest Visit Date',
    size: 150,
    cell: ({ getValue }) => {
      const value = getValue<string>();
      if (value) {
        const date = new Date(value);
        return date.toLocaleDateString(navigator.language);
      }

      return '';
    },
  },
  {
    accessorKey: 'report_submitted_at',
    header: 'Report Submitted At',
    cell: ({ getValue }) => {
      const value = getValue<string>();
      if (value) {
        const date = new Date();
        return date.toLocaleString(navigator.language);
      }

      return '';
    },
  },
  {
    accessorKey: 'report_no',
    header: 'Report No',
  },
  {
    accessorKey: 'client_business_name',
    header: 'Client Business Name',
  },
  {
    accessorKey: 'target',
    header: 'Target',
    size: 100,
  },
  {
    accessorKey: 'days_to_report',
    header: 'Days to Report',
    size: 100,
  },
  {
    accessorKey: 'id',
    header: 'Delay (Days)',
    cell: ({ row }) => {
      if (Number.isFinite(row.original.days_to_report) && Number.isFinite(row.original.target)) {
        return row.original.days_to_report - row.original.target;
      }
      return '';
    },
  },
];
