import { DataTable } from '@/components/data-table-2';
import AppLayout from '@/layouts/app-layout';

import { Button } from '@/components/ui/button';
import { useTable } from '@/hooks/use-table';
import { Link } from '@inertiajs/react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

interface GeneralReportProps {
  next_year: string;
  previous_year: string;
  title: string;
  columns: [
    {
      header: string;
      accessorKey: string;
    },
  ];
  data: {
    [key: string]: string | number | boolean | null;
  }[];
}

export default function FieldOperativeManhourSummary(props: GeneralReportProps) {
  const breadcrumbs = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: props.title,
      href: '.',
    },
  ];

  const table = useTable<any>('', {
    columns: props.columns,
    defaultData: props.data,
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-col px-6">
        <DataTable
          left={
            <>
              <Link
                href={route('reports.field-operatives-manhour-summary', {
                  year: props.previous_year,
                })}
              >
                <Button variant={'outline'}>
                  <ChevronLeftIcon />
                </Button>
              </Link>
              <Link
                href={route('reports.field-operatives-manhour-summary', {
                  year: props.next_year,
                })}
              >
                <Button variant={'outline'}>
                  <ChevronRightIcon />
                </Button>
              </Link>
            </>
          }
          table={table}
          pagination={false}
        />
      </div>
    </AppLayout>
  );
}
