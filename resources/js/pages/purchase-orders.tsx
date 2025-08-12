import { DataTable } from '@/components/data-table-2';
import { Badge } from '@/components/ui/badge';
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
    accessorKey: 'title',
    header: 'Title',
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
    accessorKey: 'client',
    header: 'Client',
    minSize: 150,
    maxSize: 300,
    cell: ({ row }) => row.original.client?.business_name || 'N/A',
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
    accessorKey: 'hourly_rate',
    header: 'Hourly Rate',
    minSize: 100,
    maxSize: 150,
    cell: ({ row }) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }).format(row.original.hourly_rate);
    },
  },
  {
    accessorKey: 'budgeted_hours',
    header: 'Budgeted Hours',
    minSize: 120,
    maxSize: 150,
    cell: ({ row }) => {
      return `${row.original.budgeted_hours}h`;
    },
  },
  {
    accessorKey: 'created_at',
    header: 'Created',
    minSize: 100,
    maxSize: 150,
    cell: ({ row }) => {
      return new Date(row.original.created_at).toLocaleDateString();
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    minSize: 80,
    maxSize: 80,
    cell: ({ row }) => <PurchaseOrderActions purchaseOrder={row.original} />,
  },
];

export default function PurchaseOrdersPage() {
  const table = useTable<PurchaseOrder>('/api/v1/purchase-orders', {
    columns: columns,
    defaultParams: {
      include: 'client',
    },
  });

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Home', href: '/' },
        { title: 'Purchase Orders', href: '/purchase-orders' },
      ]}
      pageAction={
        <Button>
          <Plus /> New Purchase Order
        </Button>
      }
    >
      <Head title="Purchase Orders" />
      <div className="px-6">
        <DataTable table={table} />
      </div>
    </AppLayout>
  );
}
