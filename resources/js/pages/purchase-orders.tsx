import { DataTable } from '@/components/data-table-2';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useTable } from '@/hooks/use-table';
import AppLayout from '@/layouts/app-layout';
import { PurchaseOrder } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { EllipsisVertical, Eye, Plus, Trash2 } from 'lucide-react';
import { PurchaseOrderForm } from './purchase-orders/form';
import { useState } from 'react';
import { Progress } from '@/components/ui/progress';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';

function PurchaseOrderActions(props: { purchaseOrder: PurchaseOrder }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size={'sm'}>
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{props.purchaseOrder.title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            View Details
            <DropdownMenuShortcut>
              <Eye />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className={'text-red-500'}>
            Delete
            <DropdownMenuShortcut>
              <Trash2 />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const columns: ColumnDef<PurchaseOrder>[] = [
  {
    accessorKey: 'po_number',
    header: 'PO#',
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
    accessorKey: 'budget',
    header: 'Budget',
    minSize: 100,
    maxSize: 150,
    cell: ({ row }) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(row.original.budget);
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
        { title: 'Purchase Orders', href: '/purchase-orders' },
      ]}
      pageAction={
        <PurchaseOrderForm
          open={formOpen}
          onOpenChange={setFormOpen}
          onSubmit={() => table.reload()}
        >
          <Button>
            <Plus /> New Purchase Order
          </Button>
        </PurchaseOrderForm>
      }
    >
      <Head title="Purchase Orders" />
      <div className="px-6">
        <DataTable table={table} />
      </div>
    </AppLayout>
  );
}
