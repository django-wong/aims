import { DataTable, useTableApi } from '@/components/data-table-2';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { useTable } from '@/hooks/use-table';
import AppLayout from '@/layouts/app-layout';
import { ClientForm } from '@/pages/clients/form';
import { BreadcrumbItem, Client } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { debounce } from 'lodash';
import { EllipsisVertical, Plus, Trash2 } from 'lucide-react';
import { startTransition, useMemo, useState } from 'react';

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

function ClientAction(props: { client: Client }) {
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
          <DropdownMenuItem>
            View Details
            <DropdownMenuShortcut>⇧⌘V</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem variant={'destructive'}
            disabled={true}
            onClick={() => {
              fetch(route('clients.destroy', { id: props.client.id })).then((res) => {
                if (res) {
                  table.reload();
                }
              });
            }}
          >
            Delete
            <DropdownMenuShortcut>
              <Trash2/>
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function Clients() {
  const columns: ColumnDef<Client>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <Link href={route('clients.edit', { id: row.original.id })} className={'underline'}>
          {row.original.user?.name || 'N/A'}
        </Link>
      ),
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
      size: 100,
      maxSize: 100,
      cell: ({ row }) => (
        <a href={`mailto:${row.original.user?.email}`} className={'inline-flex items-center gap-1'}>
          {/*<Mail className={'w-4'}/> */}
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
    // {
    //   accessorKey: 'address_id',
    //   header: 'Address',
    //   cell: ({ row }) => {
    //     if (!row.original.address) {
    //       return 'N/A';
    //     }
    //     const { address_line_1, city, state, zip, country } = row.original.address;
    //
    //     return (
    //       <span>
    //         {address_line_1}, {city}, {state} {zip}, {country}
    //       </span>
    //     );
    //   },
    // },
    {
      accessorKey: 'Reminder',
      header: () => {
        return (
          <>
            <span className={'cursor-help'} title={'Email reminder will be sent to the client if the invoice is approved within this days.'}>
              REMINDER (DAYS)
            </span>
          </>
        );
      },
      cell: ({ row }) => {
        return <>{row.original.invoice_reminder}</>;
      },
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => <ClientAction client={row.original} />,
    },
  ];

  const table = useTable<Client>('api/v1/clients', {
    defaultParams: {
      include: 'user,address,coordinator,reviewer',
    },
    columns,
  });

  const { searchParams, setSearchParams } = table;

  const [keywords, setKeywords] = useState(searchParams.get('filter[keywords]') || '');

  const setKeywordsSearchParams = useMemo(() => {
    return debounce((value) => {
      setSearchParams((params) => {
        params.set('filter[keywords]', value);
        return params;
      });
    }, 500);
  }, [setSearchParams]);

  const setSearchKeywords = (event: React.ChangeEvent<HTMLInputElement>) => {
    startTransition(() => {
      setKeywords(event.target.value);
      setKeywordsSearchParams(event.target.value);
    });
  };

  return (
    <>
      <Head title={'Clients'} />
      <AppLayout
        breadcrumbs={breadcrumbs}
        pageAction={
          <ClientForm onSubmit={() => table.reload()}>
            <Button size={'sm'}>
              <Plus /> New
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
              </>
            }
          />
        </div>
      </AppLayout>
    </>
  );
}
