import { Comments } from '@/components/comments';
import { HideFromClient } from '@/components/hide-from-client';
import { Info, InfoHead, InfoLine, InfoLineValue } from '@/components/info';
import { TwoColumnLayout73 } from '@/components/main-content';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQueryParam } from '@/hooks/use-query-param';
import Layout from '@/layouts/app-layout';
import { formatCurrency } from '@/lib/helpers';
import { Timesheets } from '@/pages/assignments/timesheets';
import { ApproveButton } from '@/pages/invoices/approve-button';
import { CreateClientInvoice } from '@/pages/invoices/create-client-invoice';
import { DeleteInvoice } from '@/pages/invoices/delete-invoice';
import { InvoiceStatus } from '@/pages/invoices/invoice-status';
import { Invoiceable } from '@/pages/invoices/invoiceable';
import { RejectButton } from '@/pages/invoices/reject-button';
import { RejectionReason } from '@/pages/invoices/rejection_reason';
import { SendInvoiceButton } from '@/pages/invoices/send-invoice-button';
import { InvoiceProvider } from '@/providers/invoice-provider';
import { BreadcrumbItem, Invoice, InvoiceStatusEnum } from '@/types';
import { Link } from '@inertiajs/react';
import { FileClockIcon, FileIcon, FileTextIcon, MessageCircleIcon } from 'lucide-react';

interface EditInvoicePageProps {
  invoice: Invoice;
}

export default function EditInvoicePage(props: EditInvoicePageProps) {
  const [tab, setTab] = useQueryParam('tab', 'timesheets');

  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Invoices',
      href: '/invoices',
    },
    {
      title: `#${props.invoice.id}`,
      href: '.',
    },
  ];
  return (
    <InvoiceProvider value={props.invoice}>
      <Layout
        breadcrumbs={breadcrumbs}
        pageAction={
          <>
            <SendInvoiceButton />
            <ApproveButton />
            <RejectButton />
            <CreateClientInvoice />
            <DeleteInvoice />
          </>
        }
      >
        <TwoColumnLayout73
          left={
            <div className={'grid gap-6'}>
              <RejectionReason />
              <Tabs value={tab} onValueChange={setTab} className={'grid gap-6'}>
                <TabsList>
                  <TabsTrigger value={'timesheets'}>
                    <FileClockIcon />
                    Timesheets
                  </TabsTrigger>
                  <TabsTrigger value={'comments'}>
                    <MessageCircleIcon />
                    Comments
                  </TabsTrigger>
                  <TabsTrigger value={'preview'}>
                    <FileIcon />
                    Preview
                  </TabsTrigger>
                  <TabsTrigger value={'breakdown'}>
                    <FileTextIcon />
                    Breakdown
                  </TabsTrigger>
                </TabsList>
                <TabsContent value={'preview'} className={'grid gap-6'}>
                  <div className={'overflow-hidden rounded border'}>
                    <iframe src={'/api/v1/invoices/' + props.invoice.id + '/pdf'} className={'h-[80vh] w-full'}></iframe>
                  </div>
                </TabsContent>
                <TabsContent value={'breakdown'}>
                  <div className={'overflow-hidden rounded border'}>
                    <iframe src={'/api/v1/invoices/' + props.invoice.id + '/pdf/breakdown'} className={'h-[80vh] w-full'}></iframe>
                  </div>
                </TabsContent>
                <TabsContent value={'timesheets'}>
                  <Timesheets filters={{ 'filter[invoice_id]': props.invoice.id }} />
                </TabsContent>
                <TabsContent value={'comments'}>
                  <Comments commentableType={'Invoice'} commentableId={props.invoice.id} />
                </TabsContent>
              </Tabs>
            </div>
          }
          right={
            <div>
              <Info>
                <InfoHead>About</InfoHead>
                <div>
                  <HideFromClient>
                    <InfoLine label={'Work Order #'}>
                      <Link className={'link'} href={route('purchase-orders.edit', props.invoice.purchase_order_id)}>
                        {props.invoice.purchase_order_title}
                      </Link>
                    </InfoLine>
                  </HideFromClient>
                  <InfoLine label={'Invoice To'}>
                    <Invoiceable />
                  </InfoLine>
                  <InfoLine label={'Status'}>
                    <InvoiceStatus />
                  </InfoLine>
                  <InfoLine label={'Hours'}>{props.invoice.hours}</InfoLine>
                  <InfoLine label={'Travel Distance'}>
                    {props.invoice.travel_distance} {props.invoice.travel_unit}
                  </InfoLine>
                  <InfoLine label={'Expenses'}>{formatCurrency(props.invoice.expenses)}</InfoLine>
                  <InfoLine label={'Hour Cost'}>{formatCurrency(props.invoice.hour_cost)}</InfoLine>
                  <InfoLine label={'Travel Cost'}>{formatCurrency(props.invoice.travel_cost)}</InfoLine>
                  {props.invoice.invoiceable_type === 'App\\Models\\Client' ? (
                    <InfoLine label={'Process fee'}>
                      {formatCurrency(props.invoice.process_fee)} at {props.invoice.process_fee_rate}%
                    </InfoLine>
                  ) : (
                    <InfoLine label={'Commission Rate'}>{props.invoice.commission_rate}%</InfoLine>
                  )}
                  <InfoLine label={'VAT'}>{props.invoice.tax_rate}%</InfoLine>
                  <InfoLine label={'Total'}>{formatCurrency(props.invoice.final_cost)}</InfoLine>
                </div>
                {props.invoice.status === InvoiceStatusEnum.Rejected ? (
                  <>
                    <InfoHead>Rejection Reason</InfoHead>
                    <InfoLineValue className={'justify-start'}>{props.invoice.rejection_reason}</InfoLineValue>
                  </>
                ) : null}
              </Info>
            </div>
          }
        />
      </Layout>
    </InvoiceProvider>
  );
}
