import { DataTable, useTableApi } from '@/components/data-table-2';
import { Button } from '@/components/ui/button';
import { useTable } from '@/hooks/use-table';
import AppLayout from '@/layouts/app-layout';
import { PurchaseOrder } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { Plus, Trash2Icon } from 'lucide-react';
import { PurchaseOrderForm } from './purchase-orders/form';
import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { PopoverConfirm } from '@/components/popover-confirm';
import axios from 'axios';

function PurchaseOrderActions(props: { purchaseOrder: PurchaseOrder }) {
  const table = useTableApi();

  return (
    <div className={'flex items-center justify-end'}>
      <PopoverConfirm side={'bottom'} align={'end'} message={'Are you sure to delete this work order? Please make sure it\' not been used by any assignments.'} onConfirm={() => {
        axios.delete('/api/v1/purchase-orders/' + props.purchaseOrder.id).then(() => {
          table.reload();
        });
      }} asChild>
        <Button size={'sm'} variant={'destructive'}>
          <Trash2Icon/>
        </Button>
      </PopoverConfirm>
    </div>
  );
}

const columns: ColumnDef<PurchaseOrder>[] = [
  {
    accessorKey: 'po_number',
    header: 'Work Order Number #',
    enableResizing: true,
    minSize: 200,
    size: 300,
    maxSize: 500,
    cell: ({ row }) => {
      return (
        <Link href={route('purchase-orders.edit', { id: row.original.id })} className={'underline'}>
          {row.original.title}
        </Link>
      );
    },
  },

  {
    accessorKey: 'previous_title',
    header: 'Previous Number #',
    cell: ({ row }) => (
      <>
        <span>{row.original.previous_title}</span>
      </>
    )
  },

  {
    accessorKey: 'project',
    header: 'Project',
    minSize: 150,
    maxSize: 300,
    cell: ({ row }) => row.original.project?.title || 'N/A',
  },
  {
    accessorKey: 'client',
    header: 'Client',
    minSize: 150,
    maxSize: 300,
    cell: ({ row }) => row.original.project?.client?.business_name || 'N/A',
  },
  {
    accessorKey: 'budgeted_hours',
    header: 'Budget Hours',
    minSize: 100,
    maxSize: 150,
    cell: ({ row }) => {
      // return new Intl.NumberFormat('en-US', {
      //   style: 'currency',
      //   currency: 'USD',
      // }).format(row.original.budgeted_hours);
      return `${row.original.budgeted_hours}`;
    },
  },
  {
    accessorKey: 'total_hours',
    header: 'Budget Hours',
    minSize: 100,
    maxSize: 150,
    cell: ({ row }) => {
      return row.original.total_hours;
    },
  },
  {
    accessorKey: 'usage',
    header: 'Usage',
    minSize: 100,
    maxSize: 150,
    cell: ({ row }) => {
      return (
        <Progress value={row.original.usage * 100}/>
      );
    }
  },
  {
    accessorKey: 'actions',
    header: () => <TableCellWrapper last>Actions</TableCellWrapper>,
    cell: ({ row }) => (
      <TableCellWrapper last>
        <PurchaseOrderActions purchaseOrder={row.original} />
      </TableCellWrapper>
    ),
  },
];

export default function PurchaseOrdersPage() {
  const [formOpen, setFormOpen] = useState(false);

  const table = useTable<PurchaseOrder>('/api/v1/purchase-orders', {
    columns: columns,
    defaultParams: {
      include: 'project.client',
    },
  });

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Home', href: '/' },
        { title: 'Work Orders', href: '/purchase-orders' },
      ]}
      pageAction={
        <PurchaseOrderForm
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={() => table.reload()}
        >
          <Button>
            <Plus /> New Work Order
          </Button>
        </PurchaseOrderForm>
      }
    >
      <Head title="Work Orders" />
      <div className="px-6">
        <DataTable table={table} />
      </div>
    </AppLayout>
  );
}
