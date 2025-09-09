import { ColumnToggle, DataTable } from '@/components/data-table-2';
import { useTable } from '@/hooks/use-table';
import Layout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Hours Log',
    href: '.',
  },
];

export default function HoursLog(props: any) {
  const table = useTable('/api/v1/reports/hours-log', {
    columns,
  });

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Head title="hours-log" />
      <div className={'px-6'}>
        <DataTable left={
          <Input placeholder="Search..." className={'w-[200px]'}/>
        } table={table} right={<ColumnToggle/>} />
      </div>
    </Layout>
  );
}


interface HoursLog {
  id: string | number
  inspector_name: string | number
  client_group: string | number
  client_name: string | number
  client_code: string | number
  reference_number: string | number
  report_number: string | number
  project_title: string | number
  project_type: string | number
  main_vendor_name: string | number
  main_vendor_address_line_1: string | number
  equipment_description: string | number
  skill_name: string | number
  i_e_a: string | number
  visit_date: string | number
  recorded_at: string | number
  flash_report_sent: string | number
  work_type: string | number
  problem: string | number
  issued_at: string | number
  work_hours: string | number
  travel_hours: string | number
  report_hours: string | number
  total_hours: string | number
  overnights: string | number
  travel_distance: string | number
  client_approved_at: string | number
  report_required: string | number
  order_received_date: string | number
  status: string | number
  close_date: string | number
  org_id: string | number
  org_name: string | number
  client_invoice_number: string | number
  contractor_invoice_number: string | number
  hour_cost: string | number
  travel_cost: string | number
  meal: string | number
  rail_or_airfare: string | number
  hotel: string | number
  other: string | number
  total_expense: string | number
  invoice_amount: string | number
  vat: string | number
}

const columns: ColumnDef<HoursLog>[] = [
  {
    accessorKey: 'inspector_name',
    header: 'Inspector Name',
  },
  {
    accessorKey: 'client_group',
    header: 'Client Group',
  },
  {
    accessorKey: 'client_name',
    header: 'Client Name',
  },
  {
    accessorKey: 'client_code',
    header: 'Client Code',
  },
  {
    accessorKey: 'reference_number',
    header: 'Reference Number',
  },
  {
    accessorKey: 'report_number',
    header: 'Report Number',
  },
  {
    accessorKey: 'project_title',
    header: 'Project Title',
  },
  {
    accessorKey: 'project_type',
    header: 'Project Type',
  },
  {
    accessorKey: 'main_vendor_name',
    header: 'Main Vendor Name',
  },
  {
    accessorKey: 'main_vendor_address_line_1',
    header: 'Main Vendor Address Line 1',
  },
  {
    accessorKey: 'equipment_description',
    header: 'Equipment Description',
  },
  {
    accessorKey: 'skill_name',
    header: 'Skill Name',
  },
  {
    accessorKey: 'i_e_a',
    header: 'I E A',
  },
  {
    accessorKey: 'visit_date',
    header: 'Visit Date',
  },
  {
    accessorKey: 'recorded_at',
    header: 'Recorded At',
  },
  {
    accessorKey: 'flash_report_sent',
    header: 'Flash Report Sent',
  },
  {
    accessorKey: 'work_type',
    header: 'Work Type',
  },
  {
    accessorKey: 'problem',
    header: 'Problem',
  },
  {
    accessorKey: 'issued_at',
    header: 'Issued At',
  },
  {
    accessorKey: 'work_hours',
    header: 'Work Hours',
  },
  {
    accessorKey: 'travel_hours',
    header: 'Travel Hours',
  },
  {
    accessorKey: 'report_hours',
    header: 'Report Hours',
  },
  {
    accessorKey: 'total_hours',
    header: 'Total Hours',
  },
  {
    accessorKey: 'overnights',
    header: 'Overnights',
  },
  {
    accessorKey: 'travel_distance',
    header: 'Travel Distance',
  },
  {
    accessorKey: 'client_approved_at',
    header: 'Client Approved At',
  },
  {
    accessorKey: 'report_required',
    header: 'Report Required',
  },
  {
    accessorKey: 'order_received_date',
    header: 'Order Received Date',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'close_date',
    header: 'Close Date',
  },
  {
    accessorKey: 'org_id',
    header: 'Org Id',
  },
  {
    accessorKey: 'org_name',
    header: 'Org Name',
  },
  {
    accessorKey: 'client_invoice_number',
    header: 'Client Invoice Number',
  },
  {
    accessorKey: 'contractor_invoice_number',
    header: 'Contractor Invoice Number',
  },
  {
    accessorKey: 'hour_cost',
    header: 'Hour Cost',
  },
  {
    accessorKey: 'travel_cost',
    header: 'Travel Cost',
  },
  {
    accessorKey: 'meal',
    header: 'Meal',
  },
  {
    accessorKey: 'rail_or_airfare',
    header: 'Rail Or Airfare',
  },
  {
    accessorKey: 'hotel',
    header: 'Hotel',
  },
  {
    accessorKey: 'other',
    header: 'Other',
  },
  {
    accessorKey: 'total_expense',
    header: 'Total Expense',
  },
  {
    accessorKey: 'invoice_amount',
    header: 'Invoice Amount',
  },
  {
    accessorKey: 'vat',
    header: 'Vat',
  }
];
