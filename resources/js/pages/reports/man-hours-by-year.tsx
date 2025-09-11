import Layout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { BreadcrumbItem } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { useTable } from '@/hooks/use-table';
import { ColumnToggle, DataTable } from '@/components/data-table-2';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/'
  },
  {
    title: 'Man Hours by Year',
    href: '.'
  }
];


export default function ManHoursByYear() {
  const table = useTable('/api/v1/reports/man-hours-by-year', {
    columns
  });

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Head title="man-hours-by-year" />
      <div className={'px-4'}>
        <DataTable table={table} right={<ColumnToggle/>}/>
      </div>
    </Layout>
  );
}

interface ManHoursByYear {
  business_name: string;
  client_group: string;
  client_id: number;
  hours: {
    [year: string]: number;
  }
  total_hours: number;
}


const columns: ColumnDef<ManHoursByYear>[] = [
  {
    accessorKey: 'business_name',
    header: 'Business Name',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'client_group',
    header: 'Client Group',
    cell: info => info.getValue(),
  },
  {
    accessorKey: 'total_hours',
    header: 'Total Hours',
    cell: info => info.getValue(),
  }
];

// Dynamically add year columns for the last 25 years
const currentYear = new Date().getFullYear();
for (let year = currentYear; year >= currentYear - 25; year--) {
  columns.push({
    accessorKey: `hours.y_${year}`,
    header: year.toString(),
    cell: info => info.getValue() ?? 0,
  });
}
