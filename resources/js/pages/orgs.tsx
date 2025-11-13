import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Org } from '@/types';
import { useTable } from '@/hooks/use-table';
import { DataTable, useTableApi } from '@/components/data-table-2';
import { OrgProvider, useOrg } from '@/providers/org-provider';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon } from 'lucide-react';
import axios from 'axios';
import { PopoverConfirm } from '@/components/popover-confirm';
import { OrgForm } from '@/pages/orgs/form';
import TableCellWrapper from '@/components/ui/table-cell-wrapper';

export const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Organizations',
    href: route('orgs'),
  },
];

export default function OrgsPage() {
  const table = useTable<Org>('/api/v1/orgs', {
    defaultParams: {
      'include': 'address',
    },
    columns: [
      {
        accessorKey: 'id',
        header: '#',
        size: 50,
      },
      {
        accessorKey: 'name',
        header: 'Name',
      },
      // code
      {
        accessorKey: 'code',
        header: 'Code',
      },
      {
        accessorKey: 'address.full_address',
        header: 'Address',
      },
      {
        accessorKey: 'timezone',
        header: 'Timezone',
      },
      {
        accessorKey: 'actions',
        header: () => {
          return <TableCellWrapper last>Actions</TableCellWrapper>
        },
        cell: ({ row }) => {
          return (
            <OrgProvider value={row.original}>
              <OrgActions/>
            </OrgProvider>
          );
        },
      },
    ]
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className={'px-6'}>
        <DataTable table={table}/>
      </div>
    </AppLayout>
  );
}


function OrgActions() {
  const org = useOrg();
  const table = useTableApi();

  if (!org) {
    return null;
  }

  function trash() {
    axios.delete(route('orgs.destroy', { org: org!.id })).then(() => {
      table?.reload();
    })
  }

  return (
    <div className={'flex justify-end gap-2'}>
      <PopoverConfirm
        side={'bottom'} align={'end'}
        asChild
        message={'Are you sure to delete this organization? This can not be undone.'}
        onConfirm={trash}>
        <Button variant={'destructive'} size={'sm'}>
          <TrashIcon/>
        </Button>
      </PopoverConfirm>
      <OrgForm value={org}>
        <Button variant={'outline'} size={'sm'}>
          <PencilIcon/>
        </Button>
      </OrgForm>
    </div>
  );
}
