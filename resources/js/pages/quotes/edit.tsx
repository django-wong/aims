import Layout from '@/layouts/app-layout'
import { Head, router } from '@inertiajs/react';
import { TwoColumnLayout73 } from '@/components/main-content';
import { Info, InfoHead, InfoLine, InfoLineValue } from '@/components/info';
import { BreadcrumbItem, Quote } from '@/types';
import { Comments } from '@/components/comments';
import { Button } from '@/components/ui/button';
import { QuoteForm } from '@/pages/quotes/form';
import { describeStatus } from '@/pages/quotes';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/helpers';
import { PencilIcon } from 'lucide-react';

interface EditQuotePageProps {
  quote: Quote;
}


export default function EditQuotePage({ quote }: EditQuotePageProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: "Home",
      href: "/",
    },
    {
      title: "Quotations",
      href: route('quotations'),
    },
    {
      title: quote.serial_number,
      href: route('quotations.edit', quote.id),
    }
  ];

  return (
    <Layout
      breadcrumbs={breadcrumbs}
      pageAction={
        <>
          <QuoteForm onSubmit={() => router.reload()} value={quote}>
            <Button>
              <PencilIcon/>
              Edit
            </Button>
          </QuoteForm>
        </>
      }>
      <Head title="edit" />
      <TwoColumnLayout73
        left={
          <Comments commentableType={'Quote'} commentableId={quote.id} />
        }
        right={
          <>
            <Info>
              <div>
                <InfoHead>About this quote</InfoHead>
                <InfoLine label={'Serial Number'}>{quote.serial_number}</InfoLine>
                <InfoLine label={'Suffix'}>{quote.suffix}</InfoLine>
                <InfoLine label={'Title'}>{quote.title}</InfoLine>
                <InfoLine label={'Type'}>{quote.type}</InfoLine>
                <InfoLine label={'I-E-A'}>{quote.i_e_a}</InfoLine>
                <InfoLine label={'Status'}>
                  <Badge variant={'secondary'}>
                    {describeStatus(quote.status)}
                  </Badge>
                </InfoLine>
                <InfoLine label={'Details'}>{quote.details}</InfoLine>
              </div>
              <div>
                <InfoLine label={'Client'}>{quote.client_business_name}</InfoLine>
                <InfoLine label={'Client Ref'}>{quote.client_ref}</InfoLine>
                <InfoLine label={'Quote Client'}>{quote.quote_client_business_name}</InfoLine>
              </div>
              <div>
                <InfoLine label={'Controlling Office'}>{quote.controlling_org_name}</InfoLine>
                <InfoLine label={'Received Date'}>{formatDate(quote.received_date)}</InfoLine>
                <InfoLine label={'Due Date'}>{formatDate(quote.due_date)}</InfoLine>
                <InfoLine label={'Despatched Date'}>{formatDate(quote.despatched_date)}</InfoLine>
              </div>
              <div>
                <InfoHead>Notes</InfoHead>
                <InfoLineValue className={'justify-start'}>{quote.notes}</InfoLineValue>
              </div>
            </Info>
          </>
        }
      />
    </Layout>
  );
}
