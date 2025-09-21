import { useTableApi } from '@/components/data-table-2';
import { Button } from '@/components/ui/button';
import { DialogWrapper } from '@/components/dialog-wrapper';
import { useRole } from '@/hooks/use-role';
import { UserRoleEnum } from '@/types';
import { DialogClose } from '@/components/ui/dialog';
import { useState } from 'react';
import { Loading } from '@/components/ui/loading';

export function CreateInvoiceButton() {
  const table = useTableApi();
  const role = useRole();
  const [loading, setLoading] = useState(false);

  if (!role || [UserRoleEnum.Staff, UserRoleEnum.Admin, UserRoleEnum.PM, UserRoleEnum.Finance].indexOf(role) === -1) {
    return null;
  }

  if (table.getSelectedRowModel().rows.length === 0) {
    return null;
  }

  function submit() {
    setLoading(true);
  }

  return (
    <DialogWrapper
      trigger={<Button>Create Invoice ({table.getSelectedRowModel().rows.length})</Button>}
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
      <p>Your invoice will be issued to contract holder office if the assignment was delegated to you. <br/><br/> Predefined intercompany commission may apply.</p>
    </DialogWrapper>
  );
}
