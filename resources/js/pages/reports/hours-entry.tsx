import { ColumnToggle, DataTable } from '@/components/data-table-2';
import { useTable } from '@/hooks/use-table';
import Layout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';

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

  const table = useTable<HoursEntry>('/api/v1/reports/hours-entry', {
    columns: columns
  });


  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Head title={props.title} />
      <div className="flex flex-col px-6 gap-6">
        <DataTable
          left={
            <>
              <Input placeholder="Search..." className="max-w-sm" />
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
  reference_number: number | string;
  issued_at: number | string;
  inspector_name: number | string;
  notes: number | string;
  date_range: number | string;
  I_E_A: number | string;
  approved_at: number | string;
  report_number: number | string;
  client_name: number | string;
  client_code: number | string;
  org_name: number | string;
  operation_org_name: number | string;
  main_vendor_name: number | string;
  main_vendor_address: number | string;
  sub_vendor_name: number | string;
  sub_vendor_address: number | string;
  work_hours: number | string;
  travel_hours: number | string;
  report_hours: number | string;
  days: number | string;
  overnights: number | string;
  total_expenses: number | string;
  meals: number | string;
  rail_or_airfare: number | string;
  hour_fee: number | string;
  travel_fee: number | string;
  invoice_amount: number | string;
  client_invoice_number: number | string;
  contractor_invoice_number: number | string;
  vat: number | string;
}

const columns: ColumnDef<HoursEntry>[] = [
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
    header: 'Approved At',
    accessorKey: 'approved_at',
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
    header: 'Days',
    accessorKey: 'days',
  },
  {
    header: 'Overnights',
    accessorKey: 'overnights',
  },
  {
    header: 'Total Expenses',
    accessorKey: 'total_expenses',
  },
  {
    header: 'Meals',
    accessorKey: 'meals',
  },
  {
    header: 'Rail or Airfare',
    accessorKey: 'rail_or_airfare',
  },
  {
    header: 'Hour Fee',
    accessorKey: 'hour_fee',
  },
  {
    header: 'Travel Fee',
    accessorKey: 'travel_fee',
  },
  {
    header: 'Invoice Amount',
    accessorKey: 'invoice_amount',
  },
  {
    header: 'Client Invoice Number',
    accessorKey: 'client_invoice_number',
  },
  {
    header: 'Contractor Invoice Number',
    accessorKey: 'contractor_invoice_number',
  },
  {
    header: 'VAT',
    accessorKey: 'vat',
  },
  {
    header: 'Notes',
    accessorKey: 'notes',
  }
];
