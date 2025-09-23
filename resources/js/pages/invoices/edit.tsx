import { TwoColumnLayout73 } from '@/components/main-content';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQueryParam } from '@/hooks/use-query-param';
import Layout from '@/layouts/app-layout';
import { BreadcrumbItem, Invoice } from '@/types';
import { Info, InfoHead, InfoLine } from '@/components/info';
import { InvoiceProvider } from '@/providers/invoice-provider';
import { Invoiceable } from '@/pages/invoices/invoiceable';
import { Comments } from '@/components/comments';
import { Timesheets } from '@/pages/assignments/timesheets';

interface EditInvoicePageProps {
  invoice: Invoice;
}

export default function EditInvoicePage(props: EditInvoicePageProps) {
  const [tab, setTab] = useQueryParam('tab', 'preview');

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

    <Layout breadcrumbs={breadcrumbs}>
      <TwoColumnLayout73
        left={
          <Tabs value={tab} onValueChange={setTab} className={'grid gap-6'}>
            <TabsList>
              <TabsTrigger value={'preview'}>Preview</TabsTrigger>
              <TabsTrigger value={'timesheets'}>Timesheets</TabsTrigger>
              <TabsTrigger value={'comments'}>Comments</TabsTrigger>
            </TabsList>
            <TabsContent value={'preview'}>pdf preview</TabsContent>
            <TabsContent value={'timesheets'}>
              <Timesheets filters={{'filter[invoice_id]': props.invoice.id}}/>
            </TabsContent>
            <TabsContent value={'comments'}>
              <Comments commentableType={'Invoice'} commentableId={props.invoice.id}/>
            </TabsContent>
          </Tabs>
        }
        right={
          <div>
            <Info>
              <InfoHead>About</InfoHead>
              <div>
                <InfoLine label={'Work Order #'}>{props.invoice.purchase_order_title}</InfoLine>
                <InfoLine label={'Invoice To'}><Invoiceable/></InfoLine>
              </div>
            </Info>
          </div>
        }
      />
    </Layout>
    </InvoiceProvider>
  );
}
