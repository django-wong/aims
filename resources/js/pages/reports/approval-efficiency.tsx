import { ColumnToggle, DataTable, ExportButton } from '@/components/data-table-2';
import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { useTable } from '@/hooks/use-table';
import Layout from '@/layouts/app-layout';
import { ApprovalEfficiency, BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { ColumnDef } from '@tanstack/react-table';
import { CircleAlertIcon } from 'lucide-react';
import { startTransition, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQueryParam } from '@/hooks/use-query-param';
import { ApprovalEfficiencyChart } from '@/pages/reports/approval-efficiency-chart';

interface ApprovalEfficiencyProps {
  [key: string]: unknown;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Approval Efficiency',
    href: '.',
  },
];

export default function ApprovalEfficiencyPage(props: ApprovalEfficiencyProps) {
  const table = useTable('/api/v1/reports/approval-efficiency', {
    columns,
  });

  const [keywords, setKeywords] = useState(table.searchParams.get('filter[keywords]') || '');

  const [tab, setTab] = useQueryParam('tab', 'table');

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <div className={'flex-1 flex flex-col gap-6 px-6 overflow-hidden'}>
        <Alert>
          <AlertIcon>
            <CircleAlertIcon />
          </AlertIcon>
          <AlertContent>
            <AlertTitle className={'font-bold'}>Heads up!</AlertTitle>
            <AlertDescription>For optimal performance, this report is limited to computing data for clients in last year only.</AlertDescription>
          </AlertContent>
        </Alert>
        <DataTable
          left={
            <Input
              placeholder={'Search clients...'}
              value={keywords}
              onChange={(event) => {
                startTransition(() => {
                  const value = event.target.value;
                  table.setSearchParams((params) => {
                    if (value) {
                      params.set('filter[keywords]', value);
                    } else {
                      params.delete('filter[keywords]');
                    }
                    return params;
                  });
                  setKeywords(value);
                })
              }}
              className={'w-[200px]'}
            />
          }
          table={table}
          render={(table) => {
            return tab === 'table' ? table : <ApprovalEfficiencyChart/>;
          }}
          right={
            <>
              <Tabs value={tab} onValueChange={setTab}>
                <TabsList>
                  <TabsTrigger value={'table'}>Table</TabsTrigger>
                  <TabsTrigger value={'chart'}>Chart</TabsTrigger>
                </TabsList>
              </Tabs>
              <ExportButton/>
              <ColumnToggle/>
            </>
          }
        />
      </div>
    </Layout>
  );
}

const columns: ColumnDef<ApprovalEfficiency>[] = [
  {
    header: 'Client Name',
    accessorKey: 'client_name',
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
  {
    header: 'Client Group Name',
    accessorKey: 'client_group_name',
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
  {
    header: 'Client Code',
    accessorKey: 'client_code',
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
  {
    header: 'Avg Hours',
    accessorKey: 'avg_hours',
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
  {
    header: 'Max Hours',
    accessorKey: 'max_hours',
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
  {
    header: 'Min Hours',
    accessorKey: 'min_hours',
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
  {
    header: 'Total Approvals in Last Year',
    accessorKey: 'total_approval_in_last_year',
    cell: (info) => info.getValue(),
    enableSorting: true,
  },
];
