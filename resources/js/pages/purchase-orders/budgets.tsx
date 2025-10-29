import { DataTable, useTableApi } from '@/components/data-table-2';
import { PopoverConfirm } from '@/components/popover-confirm';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { useTable } from '@/hooks/use-table';
import { usePurchaseOrder } from '@/providers/purchasr-order-provider';
import { Budget } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import axios from 'axios';
import { PencilIcon, Plus, TrashIcon } from 'lucide-react';
import { BudgetForm } from './budgets/form';
import { useState } from 'react';
import { HideFromClient } from '@/components/hide-from-client';
import { useIsClient } from '@/hooks/use-role';

function BudgetActions(props: { budget: Budget }) {
  const table = useTableApi();
  return (
    <div className={'flex items-center space-x-2'}>
      <PopoverConfirm
        side={'bottom'}
        align={'end'}
        message={'Are you sure to delete this budget?'}
        onConfirm={() => {
          axios.delete('/api/v1/budgets/' + props.budget.id).then(() => {
            table.reload();
          });
        }}
        asChild
      >
        <Button variant={'secondary'} size={'sm'}>
          <TrashIcon />
        </Button>
      </PopoverConfirm>
      <BudgetForm onSubmit={() => {table.reload()}} value={props.budget}>
        <Button variant={'secondary'} size={'sm'}>
          <PencilIcon />
        </Button>
      </BudgetForm>
    </div>
  );
}

export function Budgets() {
  const isClient = useIsClient();
  const po = usePurchaseOrder();
  const columns: ColumnDef<Budget>[] = [
    {
      accessorKey: 'rate_code',
      header: 'Rate Code',
      enableResizing: true,
      minSize: 150,
      size: 200,
      maxSize: 300,
      cell: ({ row }) => {
        return <span className="font-medium">{row.original.rate_code}</span>;
      },
    },
    {
      accessorKey: 'discipline',
      header: 'Discipline',
      minSize: 150,
      maxSize: 250,
      cell: ({ row }) => <Badge variant={'secondary'}>{row.original.assignment_type?.name || 'N/A'}</Badge>,
    },
    {
      accessorKey: 'hourly_rate',
      header: 'Hourly Rate',
      minSize: 120,
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
      accessorKey: 'travel_rate',
      header: 'Travel Rate',
      minSize: 120,
      maxSize: 150,
      cell: ({ row }) => {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        }).format(row.original.travel_rate);
      },
    },
    {
      accessorKey: 'budgeted_travel',
      header: 'Budgeted Travel',
      minSize: 140,
      maxSize: 160,
      cell: ({ row }) => {
        return `${row.original.budgeted_travel}${row.original.travel_unit ?? ""}`;
      },
    },
    {
      accessorKey: 'budgeted_expenses',
      header: 'Budgeted Expenses',
      minSize: 140,
      maxSize: 160,
      cell: ({ row }) => {
        return `$${row.original.budgeted_expenses}`;
      },
    },
    ...(isClient ? [] : [
      {
        accessorKey: 'actions',
        header: () => <TableCellWrapper last>Actions</TableCellWrapper>,
        minSize: 80,
        maxSize: 80,
        cell: ({ row }) => (
          <TableCellWrapper last>
            <BudgetActions budget={row.original} />
          </TableCellWrapper>
        ),
      } as ColumnDef<Budget>
    ])
  ];

  const table = useTable<Budget>('/api/v1/budgets', {
    columns: columns,
    defaultParams: {
      include: 'assignment_type',
      purchase_order_id: String(po?.id),
      sort: 'rate_code',
    },
  });

  const [keywords, setKeywords] = useState(table.searchParams.get('filter[keywords]') || '');

  const onSubmit = () => {
    table.reload();
  };

  return (
    <DataTable
      left={<Input value={keywords} placeholder={'Search'} className={'max-w-[200px]'} onChange={(event) => {
        setKeywords(event.target.value);
        table.setSearchParams((params) => {
          if (event.target.value) {
            params.set('filter[keywords]', event.target.value);
          } else {
            params.delete('filter[keywords]');
          }
          return params;
        })
      }}/>}
      right={
        <HideFromClient>
          <BudgetForm onSubmit={onSubmit}>
            <Button>
              <Plus /> New Budget
            </Button>
          </BudgetForm>
        </HideFromClient>
      }
      table={table}
    />
  );
}
