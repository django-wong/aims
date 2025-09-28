import { Button } from '@/components/ui/button';
import { useInvoice } from '@/providers/invoice-provider';
import { PopoverConfirm } from '@/components/popover-confirm';
import axios from 'axios';
import { useOrg } from '@/hooks/use-org';
import { router } from '@inertiajs/react';
import { Invoice } from '@/types';

export function CreateClientInvoice() {
  const invoice = useInvoice();
  const org = useOrg();

  function create() {
    axios.post<{
      invoice: Invoice
    }>(`/api/v1/invoices/${invoice?.id}/create-client-invoice`).then((response) => {
      if (response.data.invoice) {
        router.visit(
          route('invoices.edit', response.data.invoice.id)
        )
      }
    })
  }

  if (invoice && invoice.invoiceable_type === 'App\\Models\\Org' && invoice.invoiceable_id === org?.id ) {
    return (
      <>
        <PopoverConfirm side={'bottom'} align={'end'} message={'Are you sure to create client facing invoice from this one?'} onConfirm={create}>
          <Button>Create client invoice from this</Button>
        </PopoverConfirm>
      </>
    );
  }

  return null;
}
