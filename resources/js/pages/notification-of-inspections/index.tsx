import Layout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { BreadcrumbItem, NotificationOfInspection } from '@/types';
import { useTable } from '@/hooks/use-table';
import { DataTable } from '@/components/data-table-2';
import React from 'react';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { SearchIcon, SparklesIcon } from 'lucide-react';
import { formatDate, formatDateTime } from '@/lib/helpers';
import { TableCell } from '@/components/ui/table';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';
import { NotificationOfInspectionActions } from '@/pages/notification-of-inspections/actions';
import { NotificationOfInspectionProvider } from '@/providers/notification-of-inspection-provider';
import { NotificationOfInspectionForm } from '@/pages/assignments/notification-of-inspection-form';
import { Button } from '@/components/ui/button';
import { NotificationOfInspectionStatusBadge } from '@/pages/notification-of-inspections/status-badge';
import { useIsClient } from '@/hooks/use-role';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Notification of Inspections",
    href: '.'
  }
];

export default function Index() {
  const table = useTable<NotificationOfInspection>('/api/v1/notification-of-inspections', {
    columns: [
      {
        accessorKey: 'id',
        header: '#',
        cell: (info) => {
          return <>
            <Link className={'link'} href={'/notification-of-inspections/' + info.getValue()}>{info.getValue()}</Link>
          </>
        },
      },
      {
        accessorKey: 'reference_number',
        header: 'Reference Number',
        cell: ({ row }) => {
          return <Link className={'link'} href={route('assignments.edit', row.original.assignment_id)}>{row.original.reference_number}</Link>;
        },
      },
      {
        accessorKey: 'client_business_name',
        header: 'Client',
        cell: ({ row }) => {
          return <Link className={'link'} href={route('clients.edit', row.original.client_id)}>{row.original.client_business_name}</Link>;
        },
      },
      {
        accessorKey: 'inspector',
        header: 'Inspector',
        cell: ({ row }) => {
          return <span>
            {row.original.inspector_name ?? 'No Name'}
          </span>;
        },
      },
      {
        accessorKey: 'from',
        header: 'From - To',
        cell: ({ row }) => {
          return <span>
            {formatDate(row.original.from)} - {formatDate(row.original.to)}
          </span>;
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          return <NotificationOfInspectionStatusBadge status={row.original.status}/>
        }
      },
      {
        accessorKey: 'location',
        header: 'Location',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'actions',
        header: () => {
          return <TableCellWrapper last>
            Actions
          </TableCellWrapper>
        },
        cell: ({ row }) => {
          return (
            <NotificationOfInspectionProvider value={row.original}>
              <TableCellWrapper last>
                <NotificationOfInspectionActions/>
              </TableCellWrapper>
            </NotificationOfInspectionProvider>
          )
        }
      }
    ],
  });

  const is_client = useIsClient();

  return (
    <Layout
      breadcrumbs={breadcrumbs}
      pageAction={
        is_client ? (
          <NotificationOfInspectionForm>
            <Button><SparklesIcon/>Request new Inspection</Button>
          </NotificationOfInspectionForm>
        ) : null
      }>
      <Head title="index" />
      <div className={'p-6'}>
        <DataTable
          left={
            <InputGroup className={'max-w-[200px]'}>
              <InputGroupInput
                placeholder={'Search'}
                value={table.searchParams.get('filter[keywords]') ?? ''}
                onChange={(event) => {
                  table.setSearchParams((params) => {
                    params.set('filter[keywords]', event.target.value)
                    return params;
                  })
                }
              }/>
              <InputGroupAddon>
                <SearchIcon/>
              </InputGroupAddon>
            </InputGroup>
          }
          table={table}
        />
      </div>
    </Layout>
  );
}
