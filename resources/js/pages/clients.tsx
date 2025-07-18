import { DataTable } from '@/components/data-table-2';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useTable } from '@/hooks/use-table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Client } from '@/types';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { debounce } from 'lodash';
import { Divide, EllipsisVertical, Filter, Plus } from 'lucide-react';
import { startTransition, useMemo, useState } from 'react';
import { ClientForm, CoordinatorSelect } from '@/pages/clients/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { VFormField } from '@/components/vform';

const columns: ColumnDef<Client>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => <a href={route('clients.edit', row.original.id)}>
      {row.original.user?.name}
    </a>,
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
        zip,
        country
      } = row.original.address;

      return (
        <span>{address_line_1}, {city}, {state} {zip}, {country}</span>
      );
    },
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size={'sm'}>
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
    columns
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
          <ClientForm onSuccess={() => {}}>
            <Button size={'sm'}>
              <Plus /> Add new client
            </Button>
          </ClientForm>
        }
      >
        <div className={'px-6'}>
          <DataTable
            table={table}
            left={
              <>
                <Input onChange={setSearchKeywords} className={'max-w-[220px]'} placeholder={'Search by name, email'} value={keywords} />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant={'outline'}>
                      <Filter />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align={'start'}>
                    <div className={'flex flex-col gap-4'}>
                      <VFormField label={'Coordinator'} for={'coordinator'}>
                        <CoordinatorSelect/>
                      </VFormField>

                      <VFormField label={'Coordinator'} for={'coordinator'}>
                        <CoordinatorSelect/>
                      </VFormField>
                    </div>
                  </PopoverContent>
                </Popover>
              </>
            }
          />
        </div>
      </AppLayout>
    </>
  );
}
