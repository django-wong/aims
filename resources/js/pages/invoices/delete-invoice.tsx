import { Button } from '@/components/ui/button';
import { PopoverConfirm } from '@/components/popover-confirm';
import axios from 'axios';
import { useInvoice } from '@/providers/invoice-provider';
import { useTableApi } from '@/components/data-table-2';
import { router } from '@inertiajs/react';
import { useOrg } from '@/hooks/use-org';
import { useRole } from '@/hooks/use-role';
import { UserRoleEnum } from '@/types';

export function DeleteInvoice() {
  const invoice = useInvoice();
  const table = useTableApi();
  const org = useOrg();
  const role = useRole();

  if (!invoice) {
    return null;
  }

  const editable = org!.id == invoice.org_id && [
    UserRoleEnum.Admin,
    UserRoleEnum.Finance,
    UserRoleEnum.PM,
    UserRoleEnum.Staff
  ].indexOf(role as any) !== -1;

  if (!editable) {
    return null;
  }

  function destroy() {
    axios.delete(`/api/v1/invoices/${invoice?.id}`).then(() => {
      if (table) {
        table.reload();
      } else {
        router.visit('/invoices', {
          replace: true
        });
      }
    });
  }

  return (
    <PopoverConfirm asChild align={'end'} side={'bottom'} message={'Are you sure to deletet this invocie? This can not be undone.'} onConfirm={destroy}>
      <Button variant={'destructive'}>Delete</Button>
    </PopoverConfirm>
  );
}
