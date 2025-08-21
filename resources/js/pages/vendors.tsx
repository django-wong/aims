import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Vendor } from '@/types';
import { Button } from '@/components/ui/button';
import { DataTable, useTableApi } from '@/components/data-table-2';
import { useTable } from '@/hooks/use-table';
import { ColumnDef } from '@tanstack/react-table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { EllipsisVertical, PlusIcon } from 'lucide-react';
import { VendorForm } from '@/pages/vendors/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { useDebouncer } from '@/hooks/use-debounced';
import { Head } from '@inertiajs/react';

const columns: ColumnDef<Vendor>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => row.original.name
  },
  {
    accessorKey: 'business_name',
    header: 'Business Name',
    cell: ({ row }) => row.original.business_name
  },
  {
    accessorKey: 'address',
    header: 'Address',
    size: 10000,
    cell: ({ row }) => row.original.address?.full_address || 'N/A'
  },
  {
    accessorKey: 'actions',
    header: () => {
      return <div className={'text-right'}>
        Actions
      </div>
    },
    cell: ({ row }) => (
      <div className={'text-right'}>
        <VendorActions vendor={row.original}/>
      </div>
    )
  }
];

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/'
  },
  {
    title: 'Vendors',
    href: '/vendors'
  }
];

export default function Vendors() {
  const table = useTable('/api/v1/vendors', {
    columns
  });

  const [keywords, setKeywords] = useState<string>(table.searchParams.get('filter[keywords]') || '');

  const debouncer = useDebouncer();

  return (
    <AppLayout
      breadcrumbs={breadcrumbs}
      pageAction={
        <VendorForm
          onSubmit={() => table.reload()}>
          <Button>
            <PlusIcon/>
            New
          </Button>
        </VendorForm>
      }>
      <Head title={'Vendors'}/>
      <div className={'px-6'}>
        <DataTable
          left={
            <Input
              className={'w-[300px]'}
              placeholder={'Search vendors...'}
              value={keywords}
              onChange={(event) => {
                setKeywords(event.target.value);
                debouncer(() => {
                  table.setSearchParams((params) => {
                    params.set('filter[keywords]', event.target.value);
                    return params;
                  })
                })
              }}
            />
          }
          table={table}
        />
      </div>
    </AppLayout>
  );
}

function VendorActions({ vendor }: { vendor: Vendor }) {
  const table = useTableApi();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size={'sm'}>
          <EllipsisVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuItem
            className={'text-red-500'}
            onClick={() => {
              fetch(route('users.destroy', { id: vendor.id })).then((res) => {
                if (res) {
                  table.reload();
                }
              });
            }}
          >
            Delete
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>TODOS</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
