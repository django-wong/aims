import { DataTable } from '@/components/data-table-2';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useTable } from '@/hooks/use-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Client } from '@/types';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { debounce } from 'lodash';
import { EllipsisVertical, Plus } from 'lucide-react';
import { startTransition, useCallback, useMemo, useState } from 'react';

const columns: ColumnDef<Client>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <>{row.original.user?.name}</>,
    size: 200,
  },
  {
    accessorKey: 'business_name',
    header: 'Business Name / Group',
    cell: ({ row }) => row.original.business_name || 'N/A',
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <a href={`mailto:${row.original.user?.email}`} className={'text-blue-500 hover:underline'}>
        {row.original.user?.email}
      </a>
    ),
  },
  {
    accessorKey: 'coordinator',
    header: 'Coordinator',
    cell: ({ row }) => row.original.coordinator?.name || 'N/A',
  },
  {
    accessorKey: 'reviewer',
    header: 'Reviewer',
    cell: ({ row }) => row.original.reviewer?.name || 'N/A',
  },
  {
    accessorKey: 'address_id',
    header: 'Address',
    cell: ({ row }) => {
      if (! row.original.address) {
        return 'N/A';
      }
      const {
        address_line_1,
        city,
        state,
        postal_code,
        country
      } = row.original.address;

      return (
        <span>{address_line_1}, {city}, {state} {postal_code}, {country}</span>
      );
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <EllipsisVertical />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
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
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Clients',
    href: '/clients',
  },
];

export default function Clients() {
  const table = useTable<Client>('api/v1/clients', {
    defaultParams: {
      include: 'user,address,coordinator,reviewer',
    },
    columns,
    defaultData: [
      {
        id: 0,
        org_id: 0,
        business_name: 'Awesome business',
        email: '',
        user_id: 0,
        coordinator_id: 0,
        address_id: 0,
        invoice_reminder: 7,
        created_at: '2023-01-01T00:00:00Z',
        updated_at: '2023-01-01T00:00:00Z',
        user: {
          id: 0,
          name: 'Django Wong',
          email: 'me@djangowong.com',
        },
        address: {
          address_line_1: '123 Main St',
          address_line_2: 'Suite 100',
          city: 'Cityville',
          state: 'State',
          postal_code: '12345',
          country: 'Country',
          latitude: 0,
          longitude: 0,
        },
      },
    ],
  });

  const { searchParams, setSearchParams } = table;

  const [keywords, setKeywords] = useState(searchParams.get('filter[keywords]') || '');

  const setKeywordsSearchParams = useMemo(() => {
    return debounce((value) => {
      setSearchParams((params) => {
        params.set('filter[keywords]', value);
        return params;
      })
    }, 500);
  }, [setSearchParams]);

  const setSearchKeywords = (event: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setKeywords(event.target.value);
      setKeywordsSearchParams(event.target.value);
    })
  };

  return (
    <>
      <Head title={'Clients'} />
      <AppLayout
        breadcrumbs={breadcrumbs}
        pageAction={
          <Button size={'sm'}>
            {' '}
            <Plus /> Add new client
          </Button>
        }
      >
        <div className={'px-6'}>
          <DataTable
            onRowClick={(row) => {
              // Navigate to the client details page
              console.info(row);
            }}
            table={table}
            left={<Input onChange={setSearchKeywords} placeholder={'Search by name, email'} value={keywords} />}
          />
        </div>
      </AppLayout>
    </>
  );
}
