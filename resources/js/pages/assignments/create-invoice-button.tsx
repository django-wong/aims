import { useTableApi } from '@/components/data-table-2';
import { Button } from '@/components/ui/button';
import { DialogWrapper } from '@/components/dialog-wrapper';
import { useRole } from '@/hooks/use-role';
import { UserRoleEnum } from '@/types';
import { DialogClose } from '@/components/ui/dialog';
import { useState } from 'react';
import { Loading } from '@/components/ui/loading';
import axios from 'axios';
import { router } from '@inertiajs/react';
import { useInvoice } from '@/providers/invoice-provider';

export function CreateInvoiceButton() {
  const invoice = useInvoice();


  const table = useTableApi();
  const role = useRole();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Only show the button when there's no invoice (on assignment timesheets page), user has the right role, and there are selected timesheets
  if (invoice) {
    return null;
  }

  if (!role || [UserRoleEnum.Staff, UserRoleEnum.Admin, UserRoleEnum.PM, UserRoleEnum.Finance].indexOf(role) === -1) {
    return null;
  }

  if (table.selections.length === 0) {
    return null;
  }

  function submit() {
    setLoading(true);
    axios.post('/api/v1/invoices/from-timesheets', {
      timesheets: table.selections
    }).then((response) => {
      if (response) {
        router.visit(route('invoices'));
      }
    }).finally(() => {
      setLoading(false);
    })
  }

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      trigger={<Button>Create Invoice ({table.selections.length})</Button>}
      title={'Create Invoice'}
      description={'Create invoice from selected timesheets'}
      footer={
        <>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled={loading} variant="primary" type="submit" onClick={submit}>
            <Loading show={loading}/>
            Create Invoice
          </Button>
        </>
      }
    >
      <div className={'grid gap-4 text-center'}>
        <p>Timesheets that belong to the same work order will be included in one invoice, and will be ignored if it's already invoiced.</p>
        <p className={'text-muted-foreground'}>Predefined intercompany commission may apply.</p>
      </div>
    </DialogWrapper>
  );
}
