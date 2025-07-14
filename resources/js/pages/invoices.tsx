import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Invoice } from '@/types';
import { DataTable } from '@/components/data-table-2';

import { useTable } from '@/hooks/use-table';
import { ColumnDef } from '@tanstack/react-table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'invoiceable_id',
    header: 'Invoiceable ID',
    cell: ({ row }) => {
      return <>
        {row.original?.invoiceable?.id}
      </>;
    }
  },
  {
    accessorKey: 'assignment_id',
    header: 'Assignment',
    cell: ({ row }) => {
      return <>{row.original.assignment?.project?.name}</>;
    }
  },
  {
    accessorKey: 'action',
    header: '',
    cell: ({ row }) => {
      return <span>TODO</span>;
    }
  }
];

export default function Page() {
  const table = useTable<Invoice>('api/v1/invoices', {
    columns
  });
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-col px-6">
        <Tabs defaultValue={'sent'} className={'gap-6'}>
          <TabsList>
            <TabsTrigger value={'sent'}>Sent</TabsTrigger>
            <TabsTrigger value={'received'}>Received</TabsTrigger>
          </TabsList>
          <TabsContent value={'sent'}>
            <DataTable table={table}/>
          </TabsContent>
          <TabsContent value={'received'}>
            You haven't received any invoices from operation office.
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
