import Layout from '@/layouts/app-layout';
import { BreadcrumbItem, PurchaseOrder } from '@/types';
import { Head } from '@inertiajs/react';
import { TwoColumnLayout73 } from '@/components/main-content';
import { Info, InfoHead, InfoLine } from '@/components/info';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Comments } from '@/components/comments';
import { InfoIcon, MessagesSquareIcon } from 'lucide-react';
import { useQueryParam } from '@/hooks/use-query-param';

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
    <Layout breadcrumbs={breadcrumbs} largeTitle={props.purchase_order.title}>
      <Head title={props.purchase_order.title} />
      <TwoColumnLayout73
        left={
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className={'mb-4'}>
              <TabsTrigger value={'overview'}>
                <InfoIcon />
                <span className={'hidden lg:inline'}>Overview</span>
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
          </Tabs>
        }
        right={
          <div className="space-y-6">
            <Info>
              <InfoHead>Basic Information</InfoHead>
              <div className="space-y-3">
                <InfoLine label={'Title'} icon={'info'}>
                  {props.purchase_order.title}
                </InfoLine>
                <InfoLine label={'Client'} icon={'user'}>
                  {props.purchase_order.client?.business_name || 'No client assigned'}
                </InfoLine>
                <InfoLine label={'Created'} icon={'calendar'}>
                  {new Date(props.purchase_order.created_at).toLocaleDateString()}
                </InfoLine>
                <InfoLine label={'Last Updated'} icon={'clock'}>
                  {new Date(props.purchase_order.updated_at).toLocaleDateString()}
                </InfoLine>
              </div>
            </Info>

            <Info>
              <InfoHead>Budget & Rates</InfoHead>
              <div className="space-y-3">
                <InfoLine label={'Budget'} icon={'dollar-sign'}>
                  ${props.purchase_order.budget.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </InfoLine>
                <InfoLine label={'Hourly Rate'} icon={'clock'}>
                  ${props.purchase_order.hourly_rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/hr
                </InfoLine>
                <InfoLine label={'Budgeted Hours'} icon={'clock'}>
                  {props.purchase_order.budgeted_hours.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} hours
                </InfoLine>
              </div>
            </Info>

            <Info>
              <InfoHead>Alert Thresholds</InfoHead>
              <div className="space-y-3">
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
      <div className="p-4 bg-muted/50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Purchase Order Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Status</p>
            <p className="text-sm">Active</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Budget Utilization</p>
            <p className="text-sm">
              {/* This would be calculated based on actual time entries */}
              0% used
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Hours Remaining</p>
            <p className="text-sm">
              {props.purchase_order.budgeted_hours.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })} hours
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Budget Remaining</p>
            <p className="text-sm">
              ${props.purchase_order.budget.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 bg-muted/50 rounded-lg">
        <h4 className="text-md font-medium mb-2">Quick Actions</h4>
        <p className="text-sm text-muted-foreground">
          Edit purchase order details, manage assignments, or update budget allocations.
        </p>
      </div>
    </div>
  );
}
