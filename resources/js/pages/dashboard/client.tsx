import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQueryParam } from '@/hooks/use-query-param';
import AppLayout from '@/layouts/app-layout';
import { TimesheetsTable } from '@/pages/assignments/timesheets-table';
import { InvoicesTable } from '@/pages/invoices';
import { PurchaseOrderProgress } from '@/pages/purchase-orders/progress';
import { TableConfigurationProvider } from '@/providers/table-configuration';
import { BreadcrumbItem } from '@/types';
import { Link } from '@inertiajs/react';
import { ArrowUpRightIcon, LinkIcon } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

interface ClientDashboardProps {
  purchase_order: {
    count: number;
    top_one: {
      title: string;
      usage: number;
    };
  };
  assignments: {
    closed: number;
    open: number;
  };
  timesheets: {
    open: number;
  };
  pending_invoices: number;
  rejected_invoices: number;
}
export default function ClientDashboard(props: ClientDashboardProps) {
  const [tab, setTab] = useQueryParam('tab', 'open_timesheets');
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="">
        <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs md:grid-cols-2 lg:grid-cols-4 lg:px-6">
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Open Assignments</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{props.assignments.open}</CardTitle>
              <CardAction>
                <div className={'bg-primary/5 aspect-square rounded-full border p-2'}>
                  <Link href={route('assignments')}>
                    <LinkIcon />
                  </Link>
                </div>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 border-t text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                <Badge variant={'outline'}>{props.assignments.closed}</Badge> closed,{' '}
                <Badge variant={'outline'}>{props.assignments.closed + props.assignments.open}</Badge> in total.
              </div>
            </CardFooter>
          </Card>
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Timesheets</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {props.timesheets.open} <span className={'text-sm uppercase'}>open</span>
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex items-start gap-1.5 border-t text-sm">
              <Link href={route('timesheets')} className={'flex-1'}>
                <div className="flex w-full justify-between gap-2 font-medium">
                  <span className={'underline'}>View all</span>
                  <ArrowUpRightIcon className={'size-4'} />
                </div>
              </Link>
            </CardFooter>
          </Card>
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Invoices</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {props.pending_invoices} <span className={'text-sm uppercase'}>Pending</span>
              </CardTitle>
            </CardHeader>
            <CardFooter className="flex items-start gap-1.5 border-t text-sm">
              <Link href={route('invoices')} className={'flex-1'}>
                <div className="flex w-full justify-between gap-2 font-medium">
                  <span className={'underline'}>View all</span>
                  <ArrowUpRightIcon className={'size-4'} />
                </div>
              </Link>
            </CardFooter>
          </Card>
          <Card className="@container/card">
            <CardHeader>
              <CardDescription>Work Order</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{props.purchase_order.count}</CardTitle>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 border-t text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">{props.purchase_order.top_one.title}</div>
              <div className={'bg-muted w-full'}>
                <PurchaseOrderProgress value={props.purchase_order.top_one.usage} />
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
      <div className={'px-6'}>
        <TableConfigurationProvider value={{ toolbar: false }}>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className={'mb-4'}>
              <TabsTrigger value={'open_timesheets'}>Pending Timesheet</TabsTrigger>
              <TabsTrigger value={'open_invoices'}>Invoice</TabsTrigger>
            </TabsList>
            <TabsContent value={'open_timesheets'}>
              <TimesheetsTable
                filters={{
                  'filter[view]': 'open',
                }}
              />
            </TabsContent>
            <TabsContent value={'open_invoices'}>
              <InvoicesTable
                filters={{
                  'filter[view]': 'open',
                }}
              />
            </TabsContent>
          </Tabs>
        </TableConfigurationProvider>
      </div>
    </AppLayout>
  );
}
