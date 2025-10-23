import Layout from '@/layouts/app-layout';
import { BreadcrumbItem, PurchaseOrder } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { TwoColumnLayout73 } from '@/components/main-content';
import { Info, InfoHead, InfoLine } from '@/components/info';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Comments } from '@/components/comments';
import { ClockIcon, DollarSignIcon, InfoIcon, MessagesSquareIcon, PencilIcon } from 'lucide-react';
import { useQueryParam } from '@/hooks/use-query-param';
import { DailyHoursUsage } from '@/pages/purchase-orders/daily-usage';
import { Overview } from '@/pages/purchase-orders/overview';
import { Button } from '@/components/ui/button';
import { Budgets } from '@/pages/purchase-orders/budgets';
import { PurchaseOrderProvider } from '@/providers/purchasr-order-provider';
import { PurchaseOrderForm } from '@/pages/purchase-orders/form';
import { UsageRadarChart } from '@/pages/purchase-orders/usage-radar-chart';
import { UsageAlertGaugeChart } from '@/pages/purchase-orders/usage-alert-gauge-chart';
import { Timesheets } from '@/pages/assignments/timesheets';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/helpers';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface Props {
  purchase_order: PurchaseOrder;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Purchase Orders', href: '/' },
  { title: 'Purchase Orders', href: '/purchase-orders' },
  { title: 'Edit', href: '.' },
];

export default function PurchaseOrderEditPage(props: Props) {
  const [tab, setTab] = useQueryParam('tab', 'overview');

  return (
    <PurchaseOrderProvider value={props.purchase_order}>
    <Layout
      pageAction={
        <PurchaseOrderForm value={props.purchase_order} onSubmit={() => {router.reload()}}>
          <Button>
            <PencilIcon/>
            Edit
          </Button>
        </PurchaseOrderForm>
      }
      breadcrumbs={breadcrumbs} largeTitle={props.purchase_order.title}>
      <Head title={props.purchase_order.title} />
      <TwoColumnLayout73
        left={
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className={'mb-4'}>
              <TabsTrigger value={'overview'}>
                <InfoIcon />
                <span className={'hidden lg:inline'}>Overview</span>
              </TabsTrigger>
              <TabsTrigger value={'rates'}>
                <DollarSignIcon />
                <span className={'hidden lg:inline'}>Rate & Budgets</span>
              </TabsTrigger>
              <TabsTrigger value={'timesheets'}>
                <ClockIcon/>
                <span className={'hidden lg:inline'}>Timesheets</span>
              </TabsTrigger>
              <TabsTrigger value={'comments'}>
                <MessagesSquareIcon />
                <span className={'hidden lg:inline'}>Comments</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value={'overview'}>
              <OverviewContent purchase_order={props.purchase_order} />
            </TabsContent>
            <TabsContent value={'comments'}>
              <Comments
                commentableType={'PurchaseOrder'}
                commentableId={props.purchase_order.id}
              />
            </TabsContent>
            <TabsContent value={'rates'}>
              <PurchaseOrderProvider value={props.purchase_order}>
                <Budgets/>
              </PurchaseOrderProvider>
            </TabsContent>
            <TabsContent value={'timesheets'}>
              <Timesheets filters={{'filter[purchase_order_id]': props.purchase_order.id}}/>
            </TabsContent>
          </Tabs>
        }
        right={
          <div className="space-y-6">
            <Info>
              <InfoHead>Basic Information</InfoHead>
              <div>
                <InfoLine label={'Work Order #'} icon={'info'}>
                  {props.purchase_order.title}
                </InfoLine>
                {
                  props.purchase_order.previous_title && (
                    <InfoLine label={'Previous Work Order #'} icon={'info'}>
                      {props.purchase_order.previous_title}
                    </InfoLine>
                  )
                }
                {
                  props.purchase_order.project_id ? (
                    <InfoLine label={'Project'} icon={'library-big'}>
                      <Link className={'link'} href={route('projects.edit', props.purchase_order.project_id)}>
                        {props.purchase_order.project?.title || '--'}
                      </Link>
                    </InfoLine>
                  ) : null
                }

                {
                  props.purchase_order.project?.client_id ? (
                    <InfoLine label={'Client'} icon={'user'}>
                      <Link className={'link'} href={route('clients.edit', props.purchase_order.project?.client_id)}>
                        {props.purchase_order.project?.client?.business_name || 'N/A'}
                      </Link>
                    </InfoLine>
                  ) : null
                }

                <InfoLine label={'Created'} icon={'calendar'}>
                  {formatDateTime(props.purchase_order.created_at)}
                </InfoLine>

                <InfoLine label={'Last Updated'} icon={'clock'}>
                  {formatDateTime(props.purchase_order.updated_at)}
                </InfoLine>
              </div>
              <InfoHead>Budget vs Usage</InfoHead>
              <div>
                <InfoLine label={'Overall Budget'} icon={'dollar-sign'}>
                  <Tooltip>
                    <TooltipTrigger>
                      {formatCurrency(props.purchase_order.budget)} <span className={'text-muted-foreground text-sm'}>vs</span> {formatCurrency(props.purchase_order.total_cost)}
                    </TooltipTrigger>
                    <TooltipContent>
                      Including hours, travel, and expenses.
                    </TooltipContent>
                  </Tooltip>
                </InfoLine>

                <InfoLine label={'Hours'} icon={'clock'}>
                  {props.purchase_order.budgeted_hours} <span className={'text-muted-foreground text-sm'}>vs</span> {props.purchase_order.total_hours} hrs
                </InfoLine>

                <InfoLine label={'Travel'} icon={'car'}>
                  {props.purchase_order.budgeted_travel} <span className={'text-muted-foreground text-sm'}>vs</span> {props.purchase_order.total_travel} {props.purchase_order.travel_unit}
                </InfoLine>

                <InfoLine label={'Expenses'} icon={'dollar-sign'}>
                  {formatCurrency(props.purchase_order.budgeted_expenses)} <span className={'text-muted-foreground text-sm'}>vs</span> {formatCurrency(props.purchase_order.expenses)}
                </InfoLine>
              </div>
            </Info>

            <Info>
              <InfoHead>Alert Thresholds</InfoHead>
              <div>
                <InfoLine label={'First Alert'} icon={'alert-triangle'}>
                  {props.purchase_order.first_alert_threshold}%
                  {props.purchase_order.first_alert_at && (
                    <span className="text-sm text-gray-500 ml-2">
                      (Triggered: {new Date(props.purchase_order.first_alert_at).toLocaleDateString()})
                    </span>
                  )}
                </InfoLine>
                <InfoLine label={'Second Alert'} icon={'alert-triangle'}>
                  {props.purchase_order.second_alert_threshold}%
                  {props.purchase_order.second_alert_at && (
                    <span className="text-sm text-gray-500 ml-2">
                      (Triggered: {new Date(props.purchase_order.second_alert_at).toLocaleDateString()})
                    </span>
                  )}
                </InfoLine>
                <InfoLine label={'Final Alert'} icon={'alert-triangle'}>
                  {props.purchase_order.final_alert_threshold}%
                  {props.purchase_order.final_alert_at && (
                    <span className="text-sm text-gray-500 ml-2">
                      (Triggered: {new Date(props.purchase_order.final_alert_at).toLocaleDateString()})
                    </span>
                  )}
                </InfoLine>
                <UsageAlertGaugeChart/>
              </div>
              <InfoHead>Overall Usage</InfoHead>
              <UsageRadarChart/>
            </Info>
          </div>
        }
      />
    </Layout>
    </PurchaseOrderProvider>
  );
}

function OverviewContent(props: { purchase_order: PurchaseOrder }) {
  return (
    <div className="space-y-6">
      <PurchaseOrderProvider value={props.purchase_order}>
        <Overview/>
        <DailyHoursUsage/>
      </PurchaseOrderProvider>
    </div>
  );
}
