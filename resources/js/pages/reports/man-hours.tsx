import { DataTable } from '@/components/data-table-2';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useLocationHash } from '@/hooks/use-location-hash';
import { useTable } from '@/hooks/use-table';
import Layout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import EChartsReact from 'echarts-for-react';
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

  const [hash, setHash] = useLocationHash('table');

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Head title="man-hours" />
      <div className={'flex flex-col gap-6 px-6'}>
        <div className={'flex items-center justify-between gap-4'}>
          <div className={'flex gap-2'}>
            <Link
              href={route('reports.man-hours', {
                year: props.previous_year,
              })}
            >
              <Button variant={'outline'}>
                <ChevronLeftIcon />
              </Button>
            </Link>

            <Link href={route('reports.man-hours')}>
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
                })}
              >
                <Button variant={'outline'}>
                  <ChevronRightIcon />
                </Button>
              </Link>
            ) : null}
          </div>
          <Tabs value={hash} onValueChange={setHash}>
            <TabsList>
              <TabsTrigger value={'table'}>Table View</TabsTrigger>
              <TabsTrigger value={'chart'}>Chart</TabsTrigger>
            </TabsList>

          </Tabs>
        </div>

        { hash === 'table' ? (
          <DataTable table={table} pagination={false} />

        ) : (

          <HeatMapView data={table.data} />
        )}
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
    cell: ({ row }) => {
      return row.original.client_group || 'N/A';
    },
  },
  {
    header: 'Jan',
    accessorKey: 'monthly_hours.jan',
    cell: ({ row }) => {
      return row.original.monthly_hours.jan || 0;
    },
  },
  {
    header: 'Feb',
    accessorKey: 'monthly_hours.feb',
    cell: ({ row }) => {
      return row.original.monthly_hours.feb || 0;
    },
  },
  {
    header: 'Mar',
    accessorKey: 'monthly_hours.mar',
    cell: ({ row }) => {
      return row.original.monthly_hours.mar || 0;
    },
  },
  {
    header: 'Apr',
    accessorKey: 'monthly_hours.apr',
    cell: ({ row }) => {
      return row.original.monthly_hours.apr || 0;
    },
  },
  {
    header: 'May',
    accessorKey: 'monthly_hours.may',
    cell: ({ row }) => {
      return row.original.monthly_hours.may || 0;
    },
  },
  {
    header: 'Jun',
    accessorKey: 'monthly_hours.jun',
    cell: ({ row }) => {
      return row.original.monthly_hours.jun || 0;
    },
  },
  {
    header: 'Jul',
    accessorKey: 'monthly_hours.jul',
    cell: ({ row }) => {
      return row.original.monthly_hours.jul || 0;
    },
  },
  {
    header: 'Aug',
    accessorKey: 'monthly_hours.aug',
    cell: ({ row }) => {
      return row.original.monthly_hours.aug || 0;
    },
  },
  {
    header: 'Sep',
    accessorKey: 'monthly_hours.sep',
    cell: ({ row }) => {
      return row.original.monthly_hours.sep || 0;
    },
  },
  {
    header: 'Oct',
    accessorKey: 'monthly_hours.oct',
    cell: ({ row }) => {
      return row.original.monthly_hours.oct || 0;
    },
  },
  {
    header: 'Nov',
    accessorKey: 'monthly_hours.nov',
    cell: ({ row }) => {
      return row.original.monthly_hours.nov || 0;
    },
  },
  {
    header: 'Dec',
    accessorKey: 'monthly_hours.dec',
    cell: ({ row }) => {
      return row.original.monthly_hours.dec || 0;
    },
  },
];

function HeatMapView({ data }: { data: ManHour[] }) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // data = [...data, ...data, ...data, ...data];

  const clients = data.map((item) => item.client_name);

  const heatmapData = data.reduce(
    (data, row, index) => {
      (['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'] as Month[]).forEach((month, month_index) => {
        data.push([month_index, index, row.monthly_hours[month] || 0]);
      });
      return data;
    },
    [] as [number, number, number][],
  );

  const option = {
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    tooltip: {
      position: 'top',
    },
    grid: {
      height: '65%',
      top: '10%',
    },
    xAxis: {
      type: 'category',
      data: months,
      splitArea: {
        show: true,
      },
      axisLine: {
        show: true
      }
    },
    yAxis: {
      type: 'category',
      data: clients,
      boundaryGap: true,
      splitArea: {
        show: true,
      },
      axisLine: {
        show: true
      }
    },
    visualMap: {
      min: 0,
      max: 200,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 10,
    },
    series: [
      {
        name: 'Hours',
        type: 'heatmap',
        data: heatmapData,
        label: {
          show: true,
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 0,
          },
        },
      },
    ],
  };

  return (
    <div className={'bg-muted/30 rounded-md border h-[calc(100vh-430px)]'}>
      <EChartsReact option={option} style={{height: '100%'}}/>
    </div>
  );
}
