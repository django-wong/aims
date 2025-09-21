import { useTableApi } from '@/components/data-table-2';
import { Button } from '@/components/ui/button';
import { DialogWrapper } from '@/components/dialog-wrapper';

export function CreateInvoiceButton() {
  const table = useTableApi();

  if (table.getSelectedRowModel().rows.length === 0) {
    return null;
  }
  return (
    <DialogWrapper trigger={<Button>Create Invoice ({table.getSelectedRowModel().rows.length})</Button>} title={'Create Invoice'} description={'Create invoice from selected timesheets'}>

    </DialogWrapper>
  );
}
