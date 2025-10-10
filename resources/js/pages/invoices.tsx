import { ColumnToggle, DataTable } from '@/components/data-table-2';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Invoice } from '@/types';

import { useTable } from '@/hooks/use-table';
import { ColumnDef } from '@tanstack/react-table';

import { Input } from '@/components/ui/input';
import { SegmentedControl, SegmentedControlList, SegmentedControlTrigger } from '@/components/ui/segmented-control';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { InvoiceStatus } from '@/pages/invoices/invoice-status';
import { Invoiceable } from '@/pages/invoices/invoiceable';
import { InvoiceProvider } from '@/providers/invoice-provider';
import { Inbox, Send } from 'lucide-react';
import { useState } from 'react';
import { Link } from '@inertiajs/react';
import { formatCurrency, formatDateTime } from '@/lib/helpers';
import { HideFromClient } from '@/components/hide-from-client';
import { InvoiceActions } from '@/pages/client-invoices';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Invoices',
    href: '/invoices',
  },
];

const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    size: 80,
    cell: ({ row }) => {
      return <TableCellWrapper>
        <Link href={route('invoices.edit', row.original.id)} className={'link'}>
          #{row.original.id}
        </Link>
      </TableCellWrapper>;
    }
  },
  {
    accessorKey: 'invoiceable_id',
    header: 'Invoiceable',
    size: 200,
    cell: ({ row }) => {
      return (
        <InvoiceProvider value={row.original}>
          <Invoiceable />
        </InvoiceProvider>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      return (
        <InvoiceProvider value={row.original}>
          <InvoiceStatus />
        </InvoiceProvider>
      );
    },
  },
  {
    accessorKey: 'project_title',
    header: 'Project',
    cell: ({row}) => {
      return <TableCellWrapper>
        <Link href={route('projects.edit', row.original.project_id)} className={'link'}>
          {row.original.project_title || '—'}
        </Link>
      </TableCellWrapper>;
    }
  },
  {
    accessorKey: 'purchase_order_title',
    header: 'Purchase Order',
    cell: ({row}) => {
      return <TableCellWrapper>
        <Link href={route('purchase-orders.edit', row.original.purchase_order_id)} className={'link'}>
          {row.original.purchase_order_title || '—'}
        </Link>
      </TableCellWrapper>;
    }
  },
  {
    accessorKey: 'hours',
    header: 'Hours',
    cell: ({ row }) => {
      return <TableCellWrapper>{row.original.hours}h</TableCellWrapper>;
    }
  },
  {
    accessorKey: 'travel_distance',
    header: 'Travel',
    cell: ({ row }) => {
      return <TableCellWrapper>{row.original.travel_distance}</TableCellWrapper>;
    }
  },
  {
    accessorKey: 'expenses',
    header: 'Expenses',
    cell: ({ row }) => {
      return <TableCellWrapper>
        {formatCurrency(row.original.expenses)}
      </TableCellWrapper>;
    }
  },
  {
    accessorKey: 'cost',
    header: 'Total Amount',
    cell: ({ row }) => {
      return <TableCellWrapper>{formatCurrency(row.original.cost)}</TableCellWrapper>;
    }
  },
  {
    accessorKey: 'created_at',
    header: 'Created At',
    cell: ({ row }) => {
      return <TableCellWrapper>{formatDateTime(row.original.created_at)}</TableCellWrapper>;
    }
  },
  {
    accessorKey: 'action',
    header: () => <TableCellWrapper last>Action</TableCellWrapper>,
    cell: ({ row }) => {
      return (
        <InvoiceProvider value={row.original}>
          <TableCellWrapper last>
            <InvoiceActions />
          </TableCellWrapper>
        </InvoiceProvider>
      );
    },
  },
];

interface ClientPageProps {
  pending_count?: number;
}

export default function Page(props: ClientPageProps) {
  const table = useTable<Invoice>('api/v1/invoices', {
    columns,
    defaultParams: {
      include: 'invoiceable',
    },
  });

  const [keywords, setKeywords] = useState(table.searchParams.get('filter[keywords]') || '');

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-col px-6">
        <DataTable
          left={
            <>
              <HideFromClient>
                <SegmentedControl
                  value={table.searchParams.get('filter[type]') || 'outbound'}
                  onValueChange={(value) => {
                    table.setSearchParams((params) => {
                      params.set('filter[type]', value);
                      return params;
                    });
                  }}
                >
                  <SegmentedControlList>
                    <HideFromClient>
                      <SegmentedControlTrigger value={'outbound'}>
                        <Send size={16} />
                        Outbound
                      </SegmentedControlTrigger>
                    </HideFromClient>
                    <SegmentedControlTrigger value={'inbound'}>
                      <Inbox size={16} />
                      Inbound
                      {
                        props.pending_count ? <Badge>{props.pending_count}</Badge> : null
                      }
                    </SegmentedControlTrigger>
                  </SegmentedControlList>
                </SegmentedControl>
              </HideFromClient>
              <Input
                placeholder={'Search...'}
                className={'w-[200px]'}
                value={keywords}
                onChange={({ target: { value } }) => {
                  setKeywords(value);
                  table.setSearchParams((params) => {
                    if (value) {
                      params.set('filter[keywords]', value);
                    } else {
                      params.delete('filter[keywords]');
                    }
                    return params;
                  });
                }}
              />
            </>
          }
          table={table}
          right={<ColumnToggle />}
        />
      </div>
    </AppLayout>
  );
}
