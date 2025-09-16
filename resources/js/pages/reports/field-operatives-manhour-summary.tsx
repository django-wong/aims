import { DataTable } from '@/components/data-table-2';
import AppLayout from '@/layouts/app-layout';

import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useLocationHash } from '@/hooks/use-location-hash';
import { useTable } from '@/hooks/use-table';
import { Link } from '@inertiajs/react';
import { CalendarIcon, ChartScatterIcon, ChevronLeftIcon, ChevronRightIcon, TableIcon } from 'lucide-react';

import ReactECharts from 'echarts-for-react';

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

  const option = {
    grid: {
      left: 200,
      right: 20,
      top: 50,
      bottom: 0,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985',
        },
      },
    },
    legend: {
      textStyle: {
        fontSize: '14',
      },
      type: 'scroll',
      orient: 'vertical',
      left: 0,
      bottom: 0,
      data: props.data.map((item) => {
        return item.name;
      })
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      },
    ],
    yAxis: [
      {
        type: 'value',
      },
    ],
    series: props.data.map((item) => {
      return {
        name: item.name,
        type: 'line',
        symbol: 'none',
        smooth: 0.3,
        data: [
          item['jan_hours'],
          item['feb_hours'],
          item['mar_hours'],
          item['apr_hours'],
          item['may_hours'],
          item['jun_hours'],
          item['jul_hours'],
          item['aug_hours'],
          item['sep_hours'],
          item['oct_hours'],
          item['nov_hours'],
          item['dec_hours'],
        ],
      };
    }),
  };

  const table = useTable<any>('', {
    columns: props.columns,
    defaultData: props.data,
  });

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-col gap-6 px-6">
        <div className={'flex items-center justify-between'}>
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
            <Link href={route('reports.field-operatives-manhour-summary')}>
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
                <TableIcon />
                Table
              </TabsTrigger>
              <TabsTrigger value={'graph'}>
                <ChartScatterIcon />
                Graph
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        {hash === 'table' ? (
          <DataTable table={table} pagination={false} />
        ) : (
          <div className={'h-[calc(100vh-300px)]'}>
            <ReactECharts option={option} className={'h-full'} style={{ height: '100%' }} />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
