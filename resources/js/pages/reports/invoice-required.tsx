import { ColumnToggle, DataTable } from '@/components/data-table-2';
import { useTable } from '@/hooks/use-table';
import Layout from '@/layouts/app-layout';
import { BreadcrumbItem, TimesheetDetail } from '@/types';
import { timesheet_range } from '@/utils/utils';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { CreateInvoiceButton } from '@/pages/assignments/create-invoice-button';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Invoice Required',
    href: '.',
  },
];

export default function InvoiceRequiredPage() {
  const table = useTable('/api/v1/reports/invoice-required', {
    columns,
    selectable: true,
  });

  const [keywords, setKeywords] = useState(table.searchParams.get('filter[keywords]') || '');

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Head title="invoice-required" />
      <div className={'px-6'}>
        <DataTable
          left={
            <>
              <Input placeholder={'Search...'} className={'w-xs'} value={keywords} onChange={(event) => {
                const value = event?.target.value;
                setKeywords(value);
                table.setSearchParams((params) => {
                  if (value) {
                    params.set('filter[keywords]', value);
                  } else {
                    params.delete('filter[keywords]');
                  }
                  return params;
                })
              }}/>
              <CreateInvoiceButton/>
            </>
          }
          table={table}
          right={
            <ColumnToggle/>
          }
        />
      </div>
    </Layout>
  );
}

const columns: ColumnDef<TimesheetDetail>[] = [
  {
    accessorKey: 'reference_number',
    header: 'Reference Number',
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
  {
    accessorKey: 'inspector_name',
    header: 'Inspector Name',
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: 'range',
    header: 'Range (DD/MM/YYYY)',
    cell: ({ row }) => <span>{timesheet_range(row.original)}</span>,
  },
  {
    accessorKey: 'hours',
    header: 'Hours',
    cell: ({ row }) => <span>{row.getValue('hours')}</span>,
  },
  {
    accessorKey: 'travel_distance',
    header: 'Travel Distance',
    cell: ({ row }) => (
      <span>
        {row.getValue('travel_distance')} {row.original.mileage_unit}
      </span>
    ),
  }
];
