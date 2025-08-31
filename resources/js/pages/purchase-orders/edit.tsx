import Layout from '@/layouts/app-layout';
import { BreadcrumbItem, PurchaseOrder } from '@/types';
import { Head } from '@inertiajs/react';
import { TwoColumnLayout73 } from '@/components/main-content';
import { Info, InfoHead, InfoLine } from '@/components/info';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Comments } from '@/components/comments';
import { ArrowDownToLineIcon, DollarSignIcon, InfoIcon, MessagesSquareIcon, PencilIcon } from 'lucide-react';
import { useQueryParam } from '@/hooks/use-query-param';
import { DailyHoursUsage } from '@/pages/purchase-orders/daily-usage';
import { Overview } from '@/pages/purchase-orders/overview';
import { Button } from '@/components/ui/button';
import { Budgets } from '@/pages/purchase-orders/budgets';
import { PurchaseOrderProvider } from '@/providers/purchasr-order-provider';
import { PurchaseOrderForm } from '@/pages/purchase-orders/form';

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
    <Layout
      pageAction={
        <PurchaseOrderForm value={props.purchase_order} onSubmit={() => {window.location.reload()}}>
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
                <span className={'hidden lg:inline'}>Rates</span>
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
          </Tabs>
        }
        right={
          <div className="space-y-6">
            <Info>
              <InfoHead>Basic Information</InfoHead>
              <div>
                <InfoLine label={'PO#'} icon={'info'}>
                  {props.purchase_order.title}
                </InfoLine>
                <InfoLine label={'Project'} icon={'library-big'}>
                  {props.purchase_order.project?.title || '--'}
                </InfoLine>
                <InfoLine label={'Client'} icon={'user'}>
                  {props.purchase_order.project?.client?.business_name || 'No client assigned'}
                </InfoLine>
                <InfoLine label={'Created'} icon={'calendar'}>
                  {new Date(props.purchase_order.created_at).toLocaleDateString()}
                </InfoLine>
                <InfoLine label={'Last Updated'} icon={'clock'}>
                  {new Date(props.purchase_order.updated_at).toLocaleDateString()}
                </InfoLine>
                <InfoLine label={'Budget'} icon={'dollar-sign'}>
                  ${props.purchase_order.budget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </InfoLine>
                <InfoLine label={'Budgeted Hours'} icon={'dollar-sign'}>
                  {props.purchase_order.budgeted_hours} hrs
                </InfoLine>
                <InfoLine label={'Budgeted Mileage'} icon={'car'}>
                  {props.purchase_order.budgeted_mileage} Unit
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
              </div>
            </Info>
          </div>
        }
      />
    </Layout>
  );
}

function OverviewContent(props: { purchase_order: PurchaseOrder }) {
  return (
    <div className="space-y-6">
      <Overview/>

      <DailyHoursUsage/>

      <div>
        <Button>
          <ArrowDownToLineIcon/>
          Export as CSV
        </Button>
      </div>
    </div>
  );
}
