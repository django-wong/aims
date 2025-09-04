import { useTableApi } from '@/components/data-table-2';
import { DialogWrapper } from '@/components/dialog-wrapper';
import { Button } from '@/components/ui/button';
import { ScrollTextIcon } from 'lucide-react';
import { Form, FormField } from '@/components/ui/form';
import { useReactiveForm } from '@/hooks/use-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { VFormField } from '@/components/vform';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { DialogClose } from '@/components/ui/dialog';

const schema = z.object({
  timesheet_ids: z.array(z.number()).min(1, 'Select at least one timesheet'),
  margin: z.number().min(0).optional().nullable(),
  notes: z.string().optional().nullable()
});

export function GenerateFromSelectedTimesheets() {

  const [open, setOpen] = useState(false);

  const form = useReactiveForm({
    url: '/api/v1/invoices/from-timesheets',
    resolver: zodResolver(schema)
  });

  const table = useTableApi();

  function generate() {
    setOpen(false);
  }

  if (table.getSelectedRowModel().rows.length < 1) {
    return null;
  }

  return (
    <>
      <DialogWrapper
        open={open} onOpenChange={setOpen}
        footer={
          <>
            <DialogClose asChild><Button variant={'outline'}>Close</Button></DialogClose>
            <Button onClick={generate}>
              Generate
            </Button>
          </>
        }
        trigger={
          <Button variant={'outline'}>
            <ScrollTextIcon />
            Generate Invoice ({table.getSelectedRowModel().rows.length})
          </Button>
        }
        title={'Generate Invoice'}
        description={'Generate an invoice from the selected timesheets.'}>
        <Form {...form}>
          <div className={'grid grid-cols-12 gap-4'}>
            <FormField
              control={form.control}
              render={({field}) => {
                return (
                  <>
                    <VFormField className={'col-span-12'} label={'Margin %'} description={'The generated invoice will have this margin applied to all timesheet entries, including expenses.'}>
                      <Input step={5} value={field.value ?? ''} onChange={field.onChange} type={'number'}/>
                    </VFormField>
                  </>
                );
              }}
              name={'margin'}
            />
            <FormField
              control={form.control}
              render={({field}) => {
                return (
                  <>
                    <VFormField className={'col-span-12'} label={'Notes'}>
                      <Textarea value={field.value ?? ''} onChange={field.onChange}/>
                    </VFormField>
                  </>
                );
              }}
              name={'notes'}
            />
          </div>
        </Form>
      </DialogWrapper>
    </>
  );
}
