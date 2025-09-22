import { ColumnToggle, DataTable } from '@/components/data-table-2';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Invoice } from '@/types';

import { useTable } from '@/hooks/use-table';
import { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { SegmentedControl, SegmentedControlList, SegmentedControlTrigger } from '@/components/ui/segmented-control';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { InvoiceStatus } from '@/pages/invoices/invoice-status';
import { Invoiceable } from '@/pages/invoices/invoiceable';
import { InvoiceProvider } from '@/providers/invoice-provider';
import { EllipsisVertical, Inbox, Mail, MessageSquare, Send } from 'lucide-react';
import { useState } from 'react';

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
    accessorKey: 'action',
    header: () => <TableCellWrapper last>Action</TableCellWrapper>,
    cell: () => {
      return (
        <TableCellWrapper last>
          <InvoiceActions />
        </TableCellWrapper>
      );
    },
  },
];

export default function Page() {
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
                  <SegmentedControlTrigger value={'outbound'}>
                    <Send size={16} />
                    Outbound
                  </SegmentedControlTrigger>
                  <SegmentedControlTrigger value={'inbound'}>
                    <Inbox size={16} />
                    Inbound
                  </SegmentedControlTrigger>
                </SegmentedControlList>
              </SegmentedControl>
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        {/*<DropdownMenuLabel>My Account</DropdownMenuLabel>*/}
        {/*<DropdownMenuSeparator />*/}
        <DropdownMenuGroup>
          <DropdownMenuItem>
            View Details
            <DropdownMenuShortcut>⇧⌘V</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Duplicate
            <DropdownMenuShortcut>⇧⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Edit
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem className={'text-red-500'} disabled={true}>
            Delete
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>View Assignment</DropdownMenuItem>
          <DropdownMenuItem>View Project</DropdownMenuItem>
          <DropdownMenuItem>View Client</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Send Notice</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>
                  Email
                  <DropdownMenuShortcut>
                    <Mail />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  SMS
                  <DropdownMenuShortcut>
                    <MessageSquare />
                  </DropdownMenuShortcut>
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
