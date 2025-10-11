import { ColumnToggle, DataTable, useTableApi } from '@/components/data-table-2';
import AppLayout from '@/layouts/app-layout';

import { useTable } from '@/hooks/use-table';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { InvoiceStatus } from '@/pages/invoices/invoice-status';
import { Invoiceable } from '@/pages/invoices/invoiceable';
import { InvoiceProvider, useInvoice } from '@/providers/invoice-provider';
import { Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { formatCurrency, formatDateTime } from '@/lib/helpers';
import { BreadcrumbItem, Invoice, UserRoleEnum } from '@/types';
import { ApproveButton } from '@/pages/invoices/approve-button';
import { RejectButton } from '@/pages/invoices/reject-button';
import axios from 'axios';
import { PopoverConfirm } from '@/components/popover-confirm';
import { useOrg } from '@/hooks/use-org';
import { useRole } from '@/hooks/use-role';

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
          {row.original.id}
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
  // {
  //   accessorKey: 'purchase_order_title',
  //   header: 'Purchase Order',
  //   cell: ({row}) => {
  //     return <TableCellWrapper>
  //       <Link href={route('purchase-orders.edit', row.original.purchase_order_id)} className={'link'}>
  //         {row.original.purchase_order_title || '—'}
  //       </Link>
  //     </TableCellWrapper>;
  //   }
  // },
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
      return <TableCellWrapper>{row.original.travel_distance}{row.original.travel_unit}</TableCellWrapper>;
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

export default function ClientInvoicePage() {
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

export function InvoiceActions() {
  const invoice = useInvoice();
  const table = useTableApi();
  const org = useOrg();
  const role = useRole();

  if (!invoice) {
    return null;
  }

  function destroy() {
    axios.delete(`/api/v1/invoices/${invoice!.id}`).then(() => {
      if (table) {
        table.reload();
      } else {
        router.reload();
      }
    })
  }

  const editable = org!.id == invoice.org_id && [
    UserRoleEnum.Admin,
    UserRoleEnum.Finance,
    UserRoleEnum.PM,
    UserRoleEnum.Staff
  ].indexOf(role as any) !== -1;

  return (
    <div className={'flex gap-2 justify-end'}>
      <ApproveButton/>
      <RejectButton/>
      {
        editable ? (
          <PopoverConfirm asChild message={'Are you sure to delete this invoice?'} onConfirm={destroy}>
            <Button variant={'secondary'} size={'sm'}>
              <Trash2Icon/>
            </Button>
          </PopoverConfirm>
        ) : null
      }
    </div>
  );
}
