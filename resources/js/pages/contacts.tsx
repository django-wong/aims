import { useTable } from '@/hooks/use-table';
import { Contact } from '@/types';
import { ColumnDef } from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { ColumnToggle, DataTable, useTableApi } from '@/components/data-table-2';
import { useDebouncer } from '@/hooks/use-debounced';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import { PopoverConfirm } from '@/components/popover-confirm';
import { ContactForm } from '@/pages/contacts/form';

interface UseContactsTableOptions {
  contactable_id: number;
  contactable_type: string; // e.g. 'App\\Models\\Client', '
}

function ContactActions(props: { contact: Contact }) {
  const table = useTableApi();
  return (
    <div className={'flex items-center gap-2 justify-end'}>
      <PopoverConfirm
        asChild
        side={'bottom'} align={'end'}
        title={`Delete ${props.contact.name || 'Contact'}`}
        message={'Are you sure to delete this contact person?'}
        onConfirm={
          () => {
            fetch(route('contacts.destroy', { id: props.contact.id })).then((res) => {
              if (res) {
                table.reload();
              }
            });
          }
        }>
        <Button
          variant={'secondary'} size={'icon'} className={'text-destructive'}>
          <Trash2Icon/>
        </Button>
      </PopoverConfirm>
      <ContactForm value={props.contact} onSubmit={() => {table.reload()}}>
        <Button size={'icon'} variant={'secondary'}>
          <PencilIcon/>
        </Button>
      </ContactForm>
    </div>
  );
}

const columns: ColumnDef<Contact>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row }) => row.original.name || 'N/A',
  },
  {
    accessorKey: 'title',
    header: 'Title',
    cell: ({ row }) => (
      <>
        <Badge variant={'outline'}>{row.original.title || 'N/A'}</Badge>
      </>
    ),
  },
  {
    accessorKey: 'company',
    header: 'Company',
    cell: ({ row }) => row.original.company || 'N/A',
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => (
      <a href={`mailto:${row.original.email}`} className={'inline-flex items-center gap-1'}>
        {row.original.email}
      </a>
    ),
  },
  {
    accessorKey: 'phone',
    header: 'Phone',
    cell: ({ row }) => row.original.phone || 'N/A',
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => <ContactActions contact={row.original} />,
  },
];

export function useContactsTable(props: UseContactsTableOptions) {
  const table = useTable<Contact>('/api/v1/contacts', {
    columns,
    defaultParams: {
      'contactable_id': String(props.contactable_id),
      'contactable_type': String(props.contactable_type),
      'sort': 'name',
    }
  });

  const keywords = table.searchParams.get('filter[keywords]');

  const debouncer = useDebouncer();

  return {
    table,
    content: (
      <>
        <DataTable
          table={table}
          left={<>
            <Input
              defaultValue={keywords || ''}
              onChange={(event) => {
                debouncer(() => {
                  table.setSearchParams((params) => {
                    params.set('filter[keywords]', event.target.value);
                    return params;
                  })
                })
              }}
              className={'max-w-[250px]'}
              placeholder={'Search...'}
            />
          </>}
          right={
            <>
              <ColumnToggle/>
            </>
          }
        />
      </>
    )
  }
}
