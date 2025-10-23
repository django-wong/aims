import { useTable } from '@/hooks/use-table';
import { ColumnToggle, DataTable, useTableApi } from '@/components/data-table-2';
import { ColumnDef } from '@tanstack/react-table';
import { Expense } from '@/types';
import { formatCurrency } from '@/lib/helpers';
import { Button } from '@/components/ui/button';
import { FolderOpenIcon, PencilIcon, TrashIcon } from 'lucide-react';
import React from 'react';
import { ExpenseAttachments } from '@/pages/expenses/expense-attachments';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { ExpenseForm } from '@/pages/timesheet-items/log-expense-form';
import { PopoverConfirm } from '@/components/popover-confirm';
import { ExpenseProvider, useExpense } from '@/providers/expense-provider';
import axios from 'axios';
import { router } from '@inertiajs/react';

interface ExpensesTableProps extends Omit<React.ComponentProps<typeof DataTable>, 'table'> {
  params?: Record<any, any>
}

export function ExpensesTable({params, ...props}: ExpensesTableProps) {
  const table = useTable('/api/v1/expenses', {
    columns,
    defaultParams: {
      ...params,
      include: 'attachments_count',
    },
  });

  return (
    <>
      <DataTable
        right={
          <>
            <ColumnToggle/>
          </>
        }
        {...props}
        table={table}
      />
    </>
  );
}

export const columns: ColumnDef<Expense>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: info => info.getValue()
  },
  {
    accessorKey: 'type',
    header: 'Type',
    cell: info => info.getValue()
  },
  {
    accessorKey: 'invoice_number',
    header: 'Invoice #',
    cell: info => info.getValue() ?? '-'
  },
  {
    accessorKey: 'creditor',
    header: 'Creditor',
    cell: info => info.getValue() ?? '-'
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: info => info.getValue() ?? '-'
  },
  {
    accessorKey: 'net_amount',
    header: 'Net Amount',
    cell: info => formatCurrency(info.getValue() as number)
  },
  {
    accessorKey: 'gst',
    header: 'GST',
    cell: info => formatCurrency(info.getValue() as number)
  },
  {
    accessorKey: 'process_fee',
    header: 'Process Fee',
    cell: info => formatCurrency(info.getValue() as number)
  },
  {
    accessorKey: 'amount',
    header: 'Total',
    cell: info => formatCurrency(info.getValue() as number)
  },
  {
    accessorKey: 'attachments',
    header: 'Attachments',
    cell: ({ row }) => (
      <div className={'flex items-center justify-start gap-1'}>
        <ExpenseAttachments expense_id={row.original.id} onUploadComplete={() => {}}>
          <Button variant={'secondary'} size={'sm'}>
            <FolderOpenIcon /> <span>({row.original.attachments_count})</span>
          </Button>
        </ExpenseAttachments>
      </div>
    ),
  },
  {
    accessorKey: 'actions',
    header: () => <TableCellWrapper last>Actions</TableCellWrapper>,
    cell: ({row}) => {
      return <ExpenseProvider value={row.original}>
        <ExpenseActions/>
      </ExpenseProvider>
    }
  },
];

function ExpenseActions() {
  const expense = useExpense();
  const table = useTableApi();

  if (!expense) {
    return null;
  }

  function destroy() {
    axios.delete('/api/v1/expenses/' + expense!.id).then(() => {
      if (table) {
        table.reload();
      } else {
        router.reload();
      }
    });
  }

  return (
    <TableCellWrapper last className={'flex items-center justify-end gap-2'}>
      <ExpenseForm onSubmit={() => {}} value={expense}>
        <Button variant={'secondary'} size={'sm'}>
          <PencilIcon/>
        </Button>
      </ExpenseForm>

      <PopoverConfirm side={'bottom'} align={'end'} message={'Are you sure to delete this expense?'} onConfirm={destroy} asChild>
        <Button variant={'secondary'} size={'sm'}>
          <TrashIcon/>
        </Button>
      </PopoverConfirm>
    </TableCellWrapper>
  );
}
