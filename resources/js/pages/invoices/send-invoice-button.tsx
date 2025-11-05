import { Button } from '@/components/ui/button';
import { useInvoice } from '@/providers/invoice-provider';
import axios from 'axios';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Loading } from '@/components/ui/loading';
import { SendIcon } from 'lucide-react';
import { useRole } from '@/hooks/use-role';
import { InvoiceStatusEnum, UserRoleEnum } from '@/types';
import { InvoiceStatus } from '@/pages/invoices/invoice-status';

export function SendInvoiceButton() {
  const [loading, setLoading] = useState(false);
  const invoice = useInvoice();
  const role = useRole();

  if (!invoice) {
    return null;
  }


  if ([UserRoleEnum.PM, UserRoleEnum.Admin, UserRoleEnum.Staff, UserRoleEnum.Finance].indexOf(role as any) === -1) {
    return null;
  }

  function send() {
    setLoading(true);
    axios
      .post('/api/v1/invoices/' + invoice?.id + '/send')
      .then(() => {
        router.reload();
      })
      .finally(() => {
        setLoading(false);
      });
  }

  if (invoice?.status == InvoiceStatusEnum.Rejected || invoice?.status == InvoiceStatusEnum.Draft) {
    return (
      <>
        <Button disabled={loading} onClick={send}>
          <Loading show={loading} />
          Request Approval
        </Button>
      </>
    );
  }

  return null;
}
