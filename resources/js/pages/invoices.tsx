import { DataTable } from '@/components/data-table-2';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Invoice } from '@/types';

import { useTable } from '@/hooks/use-table';
import { ColumnDef } from '@tanstack/react-table';

import { Badge } from '@/components/ui/badge';
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
import { SegmentedControl, SegmentedControlList, SegmentedControlTrigger } from '@/components/ui/segmented-control';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { EllipsisVertical, House, Inbox, Mail, MessageSquare, Plus, Send, User } from 'lucide-react';
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
      if (row.original.invoiceable_type === 'App\\Models\\Client') {
        return (
          <>
            <Badge>
              <User />
              {row.original?.invoiceable?.business_name as string}
            </Badge>
          </>
        );
      }
      return (
        <>
          <Badge>
            <House />
            {row.original?.invoiceable?.name as string}
          </Badge>
        </>
      );
    },
  },
  {
    accessorKey: 'assignment_id',
    header: 'Assignment',
    size: 100000,
    cell: ({ row }) => {
      return <>{row.original.assignment?.project?.title}</>;
    },
  },
  {
    accessorKey: 'action',
    header: () => <TableCellWrapper last>Action</TableCellWrapper>,
    cell: () => {
      return (
        <TableCellWrapper last>
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
        </TableCellWrapper>
      );
    },
  },
];

export default function Page() {
  const table = useTable<Invoice>('api/v1/invoices', {
    columns,
    // defaultData: [
    // {
    //   id: 1,
    //   invoiceable_id: 1,
    //   assignment_id: 1,
    //   invoiceable_type: 'App\\Models\\Client',
    //   invoiceable: {
    //     id: 1,
    //     name: 'Client A',
    //     business_name: 'Client A Business',
    //   },
    //   assignment: {
    //     project: {
    //       name: 'Project A'
    //     }
    //   },
    //   updated_at: '2023-10-01T12:00:00Z',
    //   created_at: '2023-10-01T12:00:00Z'
    // }
    // ]
  });

  const [value, setValue] = useState('received');

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-col px-6">
        <DataTable
          left={
            <>
              <SegmentedControl value={value} onValueChange={(value) => setValue(value)}>
                <SegmentedControlList>
                  <SegmentedControlTrigger value={'sent'}>
                    <Send size={16} />
                    Sent
                  </SegmentedControlTrigger>
                  <SegmentedControlTrigger value={'received'}>
                    <Inbox size={16} />
                    Received
                  </SegmentedControlTrigger>
                </SegmentedControlList>
              </SegmentedControl>
            </>
          }
          table={table}
          right={
            <>
              <Button variant={'outline'} size={'sm'}>
                <Plus />
                New Invoice
              </Button>
            </>
          }
        />
      </div>
    </AppLayout>
  );
}
