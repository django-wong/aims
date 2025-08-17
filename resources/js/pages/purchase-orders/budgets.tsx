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
import { Budget } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { EllipsisVertical, Eye, Plus, Trash2, Edit } from 'lucide-react';
import { BudgetForm } from './budgets/form';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface BudgetsProps {
  purchaseOrderId?: number;
}

function BudgetActions(props: { budget: Budget}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size={'sm'}>
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>{props.budget.rate_code}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Edit Budget
            <DropdownMenuShortcut>
              <Edit />
            </DropdownMenuShortcut>
          </DropdownMenuItem>
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

export function Budgets({ purchaseOrderId }: BudgetsProps) {
  const columns: ColumnDef<Budget>[] = [
    // {
    //   accessorKey: 'rate_code',
    //   header: 'Rate Code',
    //   enableResizing: true,
    //   minSize: 150,
    //   size: 200,
    //   maxSize: 300,
    //   cell: ({ row }) => {
    //     return (
    //       <span className="font-medium">{row.original.rate_code}</span>
    //     );
    //   },
    // },
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
      accessorKey: 'budgeted_mileage',
      header: 'Budgeted Mileage',
      minSize: 140,
      maxSize: 160,
      cell: ({ row }) => {
        return `${row.original.budgeted_mileage} mi`;
      },
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      minSize: 80,
      maxSize: 80,
      cell: ({ row }) => <BudgetActions budget={row.original} />,
    },
  ];

  const table = useTable<Budget>('/api/v1/budgets', {
    columns: columns,
    defaultParams: {
      include: 'assignment_type',
      purchase_order_id: String(purchaseOrderId),
      sort: 'rate_code'
    },
  });

  const onSubmit = () => {
    table.reload();
  };

  return (
    <DataTable
      left={
        <Input placeholder={'Search'} className={'max-w-[200px]'}/>
      }
      right={
        <BudgetForm onSubmit={onSubmit}>
          <Button>
            <Plus /> New Budget
          </Button>
        </BudgetForm>
      }
      table={table}
    />
  );
}
