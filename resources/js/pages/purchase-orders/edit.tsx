import Layout from '@/layouts/app-layout';
import { BreadcrumbItem, PurchaseOrder } from '@/types';
import { Head } from '@inertiajs/react';
import { TwoColumnLayout73 } from '@/components/main-content';
import { Info, InfoHead, InfoLine } from '@/components/info';

interface Props {
  purchase_order: PurchaseOrder;
}

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Purchase Orders', href: '/' },
  { title: 'Purchase Orders', href: '/purchase-orders' },
  { title: 'Edit', href: '.' },
];

export default function PurchaseOrderEditPage(props: Props) {
  return (
    <Layout breadcrumbs={breadcrumbs} largeTitle={props.purchase_order.title}>
      <Head title={props.purchase_order.title} />
      <TwoColumnLayout73
        left={
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-4">Edit Purchase Order</h2>
            {/* Form or content for editing the purchase order goes here */}
            {/* Example: <PurchaseOrderForm purchaseOrder={props.purchase_order} /> */}
          </div>
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
                  {props.purchase_order.client?.name || 'No client assigned'}
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
                  ${parseFloat(props.purchase_order.budget).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </InfoLine>
                <InfoLine label={'Hourly Rate'} icon={'clock'}>
                  ${parseFloat(props.purchase_order.hourly_rate).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/hr
                </InfoLine>
                <InfoLine label={'Budgeted Hours'} icon={'time'}>
                  {parseFloat(props.purchase_order.budgeted_hours).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} hours
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
