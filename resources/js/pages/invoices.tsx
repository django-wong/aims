import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Invoice } from '@/types';
import { DataTable } from '@/components/data-table-2';

import { useTable } from '@/hooks/use-table';
import { ColumnDef } from '@tanstack/react-table';

import {
  SegmentedControl,
  SegmentedControlList,
  SegmentedControlTrigger
} from '@/components/ui/segmented-control';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { EllipsisVertical, House, Inbox, Mail, MessageSquare, Plus, Send, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub, DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Home",
    href: '/'
  },
  {
    title: "Invoices",
    href: '/invoices'
  }
];

const columns: ColumnDef<Invoice>[] = [
  {
    accessorKey: 'invoiceable_id',
    header: 'Invoiceable',
    maxSize: 100,
    minSize: 100,
    size: 100,
    cell: ({ row }) => {
      if (row.original.invoiceable_type === 'App\\Models\\Client') {
        return <>
          <Badge>
            <User/>
            {row.original?.invoiceable?.business_name as string}
          </Badge>
        </>;
      }
      return <>
        <Badge>
            <House/>
            {row.original?.invoiceable?.name as string}
          </Badge>
      </>;
    }
  },
  {
    accessorKey: 'assignment_id',
    header: 'Assignment',
    cell: ({ row }) => {
      return <>{row.original.assignment?.project?.title}</>;
    }
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: () => {
      return <DropdownMenu>
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
      </DropdownMenu>;
    }
  }
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
          left={<>
            <SegmentedControl value={value} onValueChange={(value) => setValue(value)}>
              <SegmentedControlList>
                <SegmentedControlTrigger value={'received'}>
                  <Inbox size={16}/>
                  Received
                </SegmentedControlTrigger>
                <SegmentedControlTrigger value={'sent'}>
                  <Send size={16}/>
                  Sent
                </SegmentedControlTrigger>
              </SegmentedControlList>
            </SegmentedControl>
          </>}
          table={table}
          right={<>
            <Button variant={'outline'} size={'sm'}>
              <Plus/>
              New Invoice
            </Button>
          </>}
        />
      </div>
    </AppLayout>
  );
}
