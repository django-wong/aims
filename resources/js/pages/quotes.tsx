import Layout from '@/layouts/app-layout';
import { Head, Link, router } from '@inertiajs/react';
import { BreadcrumbItem, Quote } from '@/types';
import { useTable } from '@/hooks/use-table';
import { ColumnDef } from '@tanstack/react-table';
import { formatDate } from '@/lib/helpers';
import { ColumnToggle, DataTable } from '@/components/data-table-2';
import { Input } from '@/components/ui/input';
import { QuoteProvider } from '@/providers/quote-provider';
import { QuoteActions } from '@/pages/quotes/actions';
import { QuoteForm } from '@/pages/quotes/form';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Quotations',
    href: '.',
  }
];

export default function QuotesPage() {
  const table = useTable('/api/v1/quotes', {
    columns
  });

  const [keywords, setKeywords] = useState(table.searchParams.get('filter[keywords]') || '');

  return (
    <Layout
      breadcrumbs={breadcrumbs}
      pageAction={
        <QuoteForm onSubmit={() => {table.reload()}}>
          <Button>Add New Quote</Button>
        </QuoteForm>
      }>
      <Head title="quotes" />
      <div className={'px-6'}>
        <DataTable
          left={
            <>
              <Input className={'max-w-[200px]'} placeholder={'Search...'} onChange={({target: {value}}) => {
                setKeywords(value);
                table.setSearchParams((params) => {
                  if (value) {
                    params.set('filter[keywords]', value);
                  } else {
                    params.delete('filter[keywords]');
                  }
                  return params;
                });
              }} value={keywords}/>
            </>
          }
          table={table}
          right={
            <ColumnToggle/>
          }
        />
      </div>
    </Layout>
  );
}


const columns: ColumnDef<Quote>[] = [
  {
    accessorKey: 'serial_number',
    header: 'Serial No.',
    cell: ({row}) => {
      return <Link className={'link'} href={route('quotations.edit', row.original.id)}>{row.original.serial_number}</Link>;
    }
  },
  {
    accessorKey: 'client_business_name',
    header: 'Client',
  },
  {
    accessorKey: 'quote_client_business_name',
    header: 'Quote Client',
  },
  {
    accessorKey: 'i_e_a',
    header: 'I-E-A',
  },
  {
    accessorKey: 'client_ref',
    header: 'Client Ref.',
  },
  {
    accessorKey: 'details',
    header: 'Details',
  },
  {
    accessorKey: 'controlling_org_name',
    header: 'Controlling Office',
  },
  {
    accessorKey: 'received_date',
    header: 'Received Date',
    cell: ({row}) => {
      return <span>{formatDate(row.original.received_date)}</span>
    }
  },
  {
    accessorKey: 'pass_to_user',
    header: 'Passed To',
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
  {
    accessorKey: 'due_date',
    header: 'Due Date',
    cell: ({row}) => {
      return <span>{formatDate(row.original.due_date)}</span>
    }
  },
  {
    accessorKey: 'despatched_date',
    header: 'Despatched Date',
    cell: ({row}) => {
      return <span>{formatDate(row.original.despatched_date)}</span>
    }
  },
  // status
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({row}) => {
      return describeStatus(row.original.status)
    }
  },
  // notes
  {
    accessorKey: 'notes',
    header: 'Notes',
  },
  {
    accessorKey: 'actions',
    header: '',
    cell: ({row}) => {
      return (
        <QuoteProvider value={row.original}>
          <QuoteActions/>
        </QuoteProvider>
      );
    },
  }
];


/**
 * 0: Won, 1: Lost, 2: Not Advised, 3: Waiting, 4: Declined
 * @param status
 */
export function describeStatus(status: number|null) {
  switch (status) {
    case 0:
      return 'Won'
    case 1:
      return 'Lost'
    case 2:
      return 'Not Advised'
    case 3:
      return 'Waiting'
    case 4:
      return 'Declined'
    default:
      return 'Unknown'
  }
}
