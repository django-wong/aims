import { DataTable, useTableApi } from '@/components/data-table-2';
import { PopoverConfirm } from '@/components/popover-confirm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useDebouncer } from '@/hooks/use-debounced';
import { useTable } from '@/hooks/use-table';
import AppLayout from '@/layouts/app-layout';
import { PurchaseOrderProgress } from '@/pages/purchase-orders/progress';
import { PurchaseOrder } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { InfoIcon, Plus, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { PurchaseOrderForm } from './purchase-orders/form';
import './purchase-orders/index.css';
import { useIsClient } from '@/hooks/use-role';
import { HideFromClient } from '@/components/hide-from-client';

function PurchaseOrderActions(props: { purchaseOrder: PurchaseOrder }) {
  const isClient = useIsClient();
  const table = useTableApi();

  if (isClient) {
    return null;
  }

  return (
    <div className={'flex items-center justify-end'}>
      <PopoverConfirm
        side={'bottom'}
        align={'end'}
        message={"Are you sure to delete this work order? Please make sure it' not been used by any assignments."}
        onConfirm={() => {
          axios.delete('/api/v1/purchase-orders/' + props.purchaseOrder.id).then(() => {
            table.reload();
          });
        }}
        asChild
      >
        <Button size={'sm'} variant={'destructive'}>
          <Trash2Icon />
        </Button>
      </PopoverConfirm>
    </div>
  );
}

export default function PurchaseOrdersPage() {
  const isClient = useIsClient();

  const columns: ColumnDef<PurchaseOrder>[] = [
    {
      accessorKey: 'title',
      header: 'Work Order Number #',
      enableResizing: true,
      minSize: 200,
      size: 300,
      enableSorting: true,
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
      enableSorting: false,
      cell: ({ row }) => (
        <>
          <span>{row.original.previous_title}</span>
        </>
      ),
    },

    {
      accessorKey: 'project',
      header: 'Project',
      minSize: 150,
      maxSize: 300,
      cell: ({ row }) => row.original.project?.title || 'N/A',
    },

    ...(isClient ? [] : [
      {
        accessorKey: 'client',
        header: 'Client',
        minSize: 150,
        maxSize: 300,
        cell: ({ row }) => row.original.project?.client?.business_name || 'N/A',
      } as ColumnDef<PurchaseOrder>,
    ]),

    {
      accessorKey: 'budgeted_hours',
      header: 'Budget Hours',
      minSize: 100,
      maxSize: 150,
      cell: ({ row }) => {
        return `${row.original.budgeted_hours}`;
      },
    },
    {
      accessorKey: 'total_hours',
      header: () => {
        return (
          <div className={'flex items-center gap-1'}>
            Total Used Hours
            <Tooltip>
              <TooltipTrigger>
                <InfoIcon className={'size-3'} />
              </TooltipTrigger>
              <TooltipContent>Hours from all assignments including unapproved.</TooltipContent>
            </Tooltip>
          </div>
        );
      },
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
        return <PurchaseOrderProgress value={row.original.usage} />;
      },
    },

    ...(isClient ? [] : [
        {
        accessorKey: 'actions',
        header: () => <TableCellWrapper last>Actions</TableCellWrapper>,
        cell: ({ row }) => (
          <TableCellWrapper last>
            <PurchaseOrderActions purchaseOrder={row.original} />
          </TableCellWrapper>
        ),
      } as ColumnDef<PurchaseOrder>
    ])
  ];
  const table = useTable<PurchaseOrder>('/api/v1/purchase-orders', {
    columns: columns,
    defaultParams: {
      include: 'project.client',
    },
  });

  const debouncer = useDebouncer();
  const [formOpen, setFormOpen] = useState(false);
  const [keywords, setKeywords] = useState(table.searchParams.get('filter[keywords]') || '');

  function onKeywordsChange(value: string) {
    setKeywords(value);
    debouncer(() => {
      table.setSearchParams((params) => {
        if (value) {
          params.set('filter[keywords]', value);
        } else {
          params.delete('filter[keywords]');
        }
        return params;
      });
    });
  }

  return (
    <AppLayout
      breadcrumbs={[
        { title: 'Home', href: '/' },
        { title: 'Work Orders', href: '/purchase-orders' },
      ]}
      pageAction={
        <HideFromClient>
          <PurchaseOrderForm open={formOpen} onOpenChange={setFormOpen} onSubmit={() => table.reload()}>
            <Button>
              <Plus /> New Work Order
            </Button>
          </PurchaseOrderForm>
        </HideFromClient>
      }
    >
      <Head title="Work Orders" />
      <div className="purchase-orders px-6">
        <DataTable
          left={
            <Input value={keywords} onChange={(event) => onKeywordsChange(event.target.value)} className={'w-[200px]'} placeholder={'Search...'} />
          }
          table={table}
        />
      </div>
    </AppLayout>
  );
}
