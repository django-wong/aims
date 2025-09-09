import { DataTable } from '@/components/data-table-2';
import AppLayout from '@/layouts/app-layout';

import { Button } from '@/components/ui/button';
import { useTable } from '@/hooks/use-table';
import { Link } from '@inertiajs/react';
import { CalendarIcon, ChartScatterIcon, ChevronLeftIcon, ChevronRightIcon, TableIcon } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocationHash } from '@/hooks/use-location-hash';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface GeneralReportProps {
  year: string;
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

  const [hash, setHash] = useLocationHash('table');

  const table = useTable<any>('', {
    columns: props.columns,
    defaultData: props.data,
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-col px-6 gap-6">
        <div className={'flex justify-between items-center'}>
          <div className={'flex gap-2'}>
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
              href={route('reports.field-operatives-manhour-summary')}
            >
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={'outline'}>
                    <CalendarIcon/>
                    {props.year}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Click to reset to current year</TooltipContent>
              </Tooltip>
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
          </div>
          <Tabs value={hash} onValueChange={setHash}>
            <TabsList>
              <TabsTrigger value={'table'}>
                <TableIcon/>
                Table
              </TabsTrigger>
              <TabsTrigger value={'graph'}>
                <ChartScatterIcon/>
                Graph
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {
          hash === 'table' ? (
            <DataTable table={table}  pagination={false}/>
          ) : (
            <span>TODO</span>
          )
        }
      </div>
    </AppLayout>
  );
}
