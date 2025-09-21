import { useTable } from '@/hooks/use-table';
import Layout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTable } from '@/components/data-table-2';
import { BreadcrumbItem, Month } from '@/types';

interface MonthlyByYear {
  client_business_name: string;
  client_group: string;
  client_code: string;
  year: number;
  total_hours: number;
  monthly_hours: {
    [key in Month]: number;
  }
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/'
  },
  {
    title: 'Monthly by Year',
    href: '.'
  }
];

export default function ManHoursMonthlyByYear() {
  const table = useTable('/api/v1/reports/man-hours-monthly-by-year', {
    columns,
  });
  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Head title="man-hours-monthly-by-year" />
      <div className={'px-6'}>
        <DataTable table={table}/>
      </div>
    </Layout>
  );
}

const columns: ColumnDef<MonthlyByYear>[] = [
  {
    accessorKey: 'client_business_name',
    header: 'Business Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'year',
    header: 'Year',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'total_hours',
    header: 'Total',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'jan',
    header: 'Jan',
    cell: (info) => {
      return info.row.original.monthly_hours.jan
    },
  },
  {
    accessorKey: 'feb',
    header: 'Feb',
    cell: (info) => {
      return info.row.original.monthly_hours.feb
    }
  },
  {
    accessorKey: 'mar',
    header: 'Mar',
    cell: (info) => {
      return info.row.original.monthly_hours.mar
    }
  },
  {
    accessorKey: 'apr',
    header: 'Apr',
    cell: (info) => {
      return info.row.original.monthly_hours.apr
    }
  },
  {
    accessorKey: 'may',
    header: 'May',
    cell: (info) => {
      return info.row.original.monthly_hours.may
    }
  },
  {
    accessorKey: 'jun',
    header: 'Jun',
    cell: (info) => {
      return info.row.original.monthly_hours.jun
    }
  },
  {
    accessorKey: 'jul',
    header: 'Jul',
    cell: (info) => {
      return info.row.original.monthly_hours.jul
    }
  },
  {
    accessorKey: 'aug',
    header: 'Aug',
    cell: (info) => {
      return info.row.original.monthly_hours.aug
    }
  },
  {
    accessorKey: 'sep',
    header: 'Sep',
    cell: (info) => {
      return info.row.original.monthly_hours.sep
    }
  },
  {
    accessorKey: 'oct',
    header: 'Oct',
    cell: (info) => {
      return info.row.original.monthly_hours.oct
    }
  },
  {
    accessorKey: 'nov',
    header: 'Nov',
    cell: (info) => {
      return info.row.original.monthly_hours.nov
    }
  },
  {
    accessorKey: 'dec',
    header: 'Dec',
    cell: (info) => {
      return info.row.original.monthly_hours.dec
    }
  },
];
