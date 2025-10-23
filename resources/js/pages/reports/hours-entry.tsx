import { ColumnToggle, DataTable } from '@/components/data-table-2';
import { useTable } from '@/hooks/use-table';
import Layout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { useDebouncer } from '@/hooks/use-debounced';
import { useState } from 'react';
import { describeTimesheetIssue } from '@/pages/timesheets/issue';
import { CloseDate } from '@/pages/assignments/close-date';
import { formatCurrency, formatDateTime } from '@/lib/helpers';
import { useOrg } from '@/hooks/use-org';

const breadcrumbs = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Hours Entry',
    href: '.',
  },
];

export default function HoursEntryPage(props: { title: string; data: any[] }) {
  const org = useOrg();

  const columns: ColumnDef<HoursEntry>[] = [
    {
      header: 'ID',
      accessorKey: 'timesheet_id',
      cell: ({row}) => {
        return <Link className={'link'} href={route('timesheets.edit', row.original.timesheet_id)}>{row.original.timesheet_id}</Link>
      }
    },
    {
      header: 'Reference Number',
      accessorKey: 'reference_number',
    },
    {
      header: 'Org Name',
      accessorKey: 'org_name',
    },
    {
      header: 'Operation Org Name',
      accessorKey: 'operation_org_name',
    },
    {
      header: 'Issued At',
      accessorKey: 'issued_at',
    },
    {
      header: 'Inspector Name',
      accessorKey: 'inspector_name',
    },
    {
      header: 'Date Range',
      accessorKey: 'date_range',
    },
    {
      header: 'I/E/A',
      accessorKey: 'I_E_A',
    },
    {
      header: 'Skill Name',
      accessorKey: 'skill_code'
    },
    {
      header: 'Equipment Description',
      accessorKey: 'equipment_description'
    },
    {
      header: 'Issued At',
      accessorKey: 'issued_at'
    },
    {
      header: 'Approved At',
      accessorKey: 'approved_at',
    },
    {
      header: 'Report Required',
      accessorKey: 'report_required',
      cell: ({row}) => {
        return row.original.report_required ? 'Yes' : 'No';
      }
    },
    {
      header: 'Flash Report Sent',
      accessorKey: 'flash_report_sent',
      cell: ({row}) => {
        return row.original.flash_report_sent ? 'Yes' : 'No';
      }
    },
    {
      header: 'Project',
      accessorKey: 'project_title'
    },
    {
      header: 'Project Type',
      accessorKey: 'project_type'
    },
    {
      header: 'Assignment Type',
      accessorKey: 'assignment_type_name'
    },
    {
      header: 'Report Number',
      accessorKey: 'report_number',
    },
    {
      header: 'Client Name',
      accessorKey: 'client_name',
    },
    {
      header: 'Client Code',
      accessorKey: 'client_code',
    },
    {
      header: 'Main Vendor Name',
      accessorKey: 'main_vendor_name',
    },
    {
      header: 'Main Vendor Address',
      accessorKey: 'main_vendor_address',
    },
    {
      header: 'Sub Vendor Name',
      accessorKey: 'sub_vendor_name',
    },
    {
      header: 'Sub Vendor Address',
      accessorKey: 'sub_vendor_address',
    },
    {
      header: 'Problem',
      accessorKey: 'issue_code',
      cell: ({row}) => {
        return describeTimesheetIssue(row.original.issue_code)
      }
    },
    {
      header: 'Status',
      accessorKey: 'assignment_is_closed',
      cell: ({row}) => {
        return <CloseDate close_date={row.original.assignment_close_date}/>;
      }
    },
    {
      header: 'Close Date',
      accessorKey: 'assignment_close_date',
      cell: ({row}) => {
        return formatDateTime(row.original.assignment_close_date);
      }
    },
    {
      header: 'Work Hours',
      accessorKey: 'work_hours',
    },
    {
      header: 'Travel Hours',
      accessorKey: 'travel_hours',
    },
    {
      header: 'Report Hours',
      accessorKey: 'report_hours',
    },
    {
      header: 'Total Hours',
      accessorKey: 'total_hours'
    },
    {
      header: 'Days',
      accessorKey: 'days',
    },
    {
      header: 'Overnights',
      accessorKey: 'overnights',
    },
    {
      header: 'Travel Distance',
      accessorKey: 'travel_distance',
      cell: ({row}) => {
        return `${row.original.travel_distance}${row.original.travel_unit}`;
      }
    },
    {
      header: 'Hour Cost',
      accessorKey: 'hour_cost',
      cell: ({row}) => {
        return formatCurrency(row.original.hour_cost);
      }
    },
    {
      header: 'Travel Cost',
      accessorKey: 'travel_cost',
      cell: ({row}) => {
        return formatCurrency(row.original.travel_cost);
      }
    },
    {
      header: 'Meals',
      accessorKey: 'meals',
      cell: ({row}) => {
        if (row.original.expenses_by_type) {
          return formatCurrency(row.original.expenses_by_type['meals'])
        }
        return '';
      }
    },
    {
      header: 'Rail or Airfare',
      accessorKey: 'rail_or_airfare',
      cell: ({row}) => {
        if (row.original.expenses_by_type) {
          return formatCurrency(row.original.expenses_by_type['travel'])
        }
        return '';
      }
    },
    {
      header: 'Accommodations',
      accessorKey: 'accommodations',
      cell: ({row}) => {
        if (row.original.expenses_by_type) {
          return formatCurrency(row.original.expenses_by_type['accommodation']);
        }
        return '';
      }
    },
    {
      header: 'Other',
      accessorKey: 'others',
      cell: ({row}) => {
        if (row.original.expenses_by_type) {
          return formatCurrency(row.original.expenses_by_type['other']);
        }
        return '';
      }
    },
    {
      header: 'Total Expenses',
      accessorKey: 'total_expenses',
      cell: ({row}) => {
        return formatCurrency(row.original.total_expenses);
      }
    },
    {
      header: 'Hour Fee',
      accessorKey: 'hour_fee',
      cell: ({row}) => {
        return formatCurrency(row.original.hour_fee);
      }
    },
    {
      header: 'Travel Fee',
      accessorKey: 'travel_fee',
      cell: ({row}) => {
        return formatCurrency(row.original.travel_fee);
      }
    },
    {
      header: 'Invoice Amount',
      accessorKey: 'invoice_amount',
      cell: ({row}) => {
        return formatCurrency(row.original.invoice_amount);
      }
    },
    {
      header: 'VAT',
      accessorKey: 'vat',
      cell: ({row}) => {
        return `${row.original.vat}%`;
      }
    },
    // Client Approved At	Report Required	Order Received Date	Client Invoice Number	Contractor Invoice Number
    {
      header: 'Invoice Number',
      accessorKey: 'invoice_number',
      cell: ({row}) => {
        if (row.original.org_id === org?.id) {
          return row.original.client_invoice_number;
        }
        return row.original.contractor_invoice_number;
      }
    },
    {
      header: 'Invoice Approved At',
      accessorKey: 'invoice_approved_at',
      cell: ({row}) => {
        if (row.original.org_id === org?.id) {
          return row.original.client_invoice_approved_at;
        }
        return row.original.contractor_invoice_approved_at;
      }
    },
    {
      header: 'Notes',
      accessorKey: 'notes',
    }
  ];

  const table = useTable<HoursEntry>('/api/v1/reports/hours-entry', {
    columns: columns
  });

  const debouncer = useDebouncer();

  const [keywords, setKeywords] = useState(table.searchParams.get('filter[keywords]') || '');

  function onKeywordsChange(value: string) {
    setKeywords(value);
    debouncer(() => {
      table.setSearchParams((params) => {
        if (value) {
          params.set('filter[keywords]', value);
        } else {
          params.delete('filter[keywords]');
        }
        return params;
      });
    });
  }

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Head title={props.title} />
      <div className="flex flex-col px-6 gap-6">
        <DataTable
          left={
            <>
              <Input value={keywords} onChange={(event) => onKeywordsChange(event.target.value)} placeholder="Search..." className="max-w-sm" />
            </>
          }
          right={
            <ColumnToggle/>
          }
          table={table}
        />
      </div>
    </Layout>
  );
}

interface HoursEntry {
  assignment_id: number | string;
  timesheet_id: number;
  org_id: number;
  operation_org_id: number;
  reference_number: number | string;
  issued_at: number | string;
  inspector_name: number | string;
  notes: number | string;
  date_range: number | string;
  I_E_A: number | string;
  approved_at: number | string;
  report_required: number | boolean;
  report_number: number | string;
  client_name: number | string;
  client_code: number | string;
  org_name: number | string;
  operation_org_name: number | string;
  main_vendor_name: number | string;
  main_vendor_address: number | string;
  sub_vendor_name: number | string;
  sub_vendor_address: number | string;
  hour_cost: number;
  travel_cost: number;
  work_hours: number | string;
  travel_hours: number | string;
  report_hours: number | string;
  days: number | string;
  overnights: number | string;
  total_expenses: number;
  hour_fee: number;
  travel_fee: number;
  invoice_amount: number;
  client_invoice_number: number | string;
  contractor_invoice_number: number | string;
  client_invoice_approved_at: string | null;
  contractor_invoice_approved_at: string | null;
  vat: number | string;
  issue_code: string | null;
  flash_report_sent: boolean;
  assignment_close_date: string|null;
  travel_distance: number;
  travel_unit: string;
  expenses_by_type?: Record<string, number>;
}
