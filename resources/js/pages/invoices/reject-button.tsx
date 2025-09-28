import { useInvoice } from '@/providers/invoice-provider';
import { useIsClient, useRole } from '@/hooks/use-role';
import { useOrg } from '@/hooks/use-org';
import { InvoiceStatusEnum, UserRoleEnum } from '@/types';
import { RejectForm } from '@/pages/invoices/reject-form';

export function RejectButton() {
  const invoice = useInvoice();

  const role = useRole();
  const org = useOrg();
  const isClient = useIsClient();

  if (!invoice || invoice.status != InvoiceStatusEnum.Sent || !org) {
    return null;
  }

  if (invoice.invoiceable_type === 'App\\Models\\Client') {
    if (!isClient) {
      return null;
    }
  } else {
    if ([UserRoleEnum.PM, UserRoleEnum.Admin, UserRoleEnum.Staff, UserRoleEnum.Finance].indexOf(role as any) === -1 || invoice.invoiceable_id != org.id) {
      return null;
    }
  }

  return (
    <RejectForm/>
  );
}
