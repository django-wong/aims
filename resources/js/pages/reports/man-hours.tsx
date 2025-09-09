import { DataTable } from '@/components/data-table-2';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useQueryParam } from '@/hooks/use-query-param';
import { useTable } from '@/hooks/use-table';
import Layout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Man Hours',
    href: '.',
  },
];

interface ManhourProps {
  next_year: string | null;
  previous_year: string;
  year: string;
  data: ManHour[];
}

export default function ManHours(props: ManhourProps) {
  const table = useTable<ManHour>('', {
    columns: columns,
    defaultData: props.data,
  });

  const [type, setType] = useQueryParam('type', 'all');

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Head title="man-hours" />
      <div className={'flex flex-col gap-6 px-6'}>
        <div className={'flex items-center justify-between gap-4'}>
          <div className={'flex gap-2'}>
            <Link
              href={route('reports.man-hours', {
                year: props.previous_year,
                type: type,
              })}
            >
              <Button variant={'outline'}>
                <ChevronLeftIcon />
              </Button>
            </Link>

            <Link href={route('reports.man-hours', {
              type: type,
            })}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={'outline'}>
                    <CalendarIcon />
                    {props.year}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Click to reset to current year</TooltipContent>
              </Tooltip>
            </Link>

            {props.next_year ? (
              <Link
                href={route('reports.man-hours', {
                  year: props.next_year,
                  type: type,
                })}
              >
                <Button variant={'outline'}>
                  <ChevronRightIcon />
                </Button>
              </Link>
            ) : null}
          </div>
          <Tabs value={type}>
            <TabsList>
              <TabsTrigger value={'all'} asChild>
                <Link
                  href={route('reports.man-hours', {
                    year: props.year,
                    type: 'all',
                  })}
                >
                  All
                </Link>
              </TabsTrigger>
              <TabsTrigger value={'local'} asChild>
                <Link
                  href={route('reports.man-hours', {
                    year: props.year,
                    type: 'local',
                  })}
                >
                  Local
                </Link>
              </TabsTrigger>
              <TabsTrigger value={'others'}>
                <Link
                  href={route('reports.man-hours', {
                    year: props.year,
                    type: 'others',
                  })}
                >
                  Others
                </Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <DataTable table={table} pagination={false} />
      </div>
    </Layout>
  );
}

type Month = 'jan' | 'feb' | 'mar' | 'apr' | 'may' | 'jun' | 'jul' | 'aug' | 'sep' | 'oct' | 'nov' | 'dec';

interface ManHour {
  client_name: string;
  client_group: string;
  monthly_hours: {
    [key in Month]: number;
  };
}

const columns: ColumnDef<ManHour>[] = [
  {
    header: 'Client Name',
    accessorKey: 'client_name',
  },
  {
    header: 'Client Group',
    accessorKey: 'client_group',
  },
  {
    header: 'Jan',
    accessorKey: 'monthly_hours.jan',
  },
  {
    header: 'Feb',
    accessorKey: 'monthly_hours.feb',
  },
  {
    header: 'Mar',
    accessorKey: 'monthly_hours.mar',
  },
  {
    header: 'Apr',
    accessorKey: 'monthly_hours.apr',
  },
  {
    header: 'May',
    accessorKey: 'monthly_hours.may',
  },
  {
    header: 'Jun',
    accessorKey: 'monthly_hours.jun',
  },
  {
    header: 'Jul',
    accessorKey: 'monthly_hours.jul',
  },
  {
    header: 'Aug',
    accessorKey: 'monthly_hours.aug',
  },
  {
    header: 'Sep',
    accessorKey: 'monthly_hours.sep',
  },
  {
    header: 'Oct',
    accessorKey: 'monthly_hours.oct',
  },
  {
    header: 'Nov',
    accessorKey: 'monthly_hours.nov',
  },
  {
    header: 'Dec',
    accessorKey: 'monthly_hours.dec',
  },
];
