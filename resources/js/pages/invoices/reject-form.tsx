import { DialogWrapper } from '@/components/dialog-wrapper';
import { Button } from '@/components/ui/button';
import { XIcon } from 'lucide-react';
import { useReactiveForm } from '@/hooks/use-form';
import { z } from 'zod';
import { Form, FormField } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useInvoice } from '@/providers/invoice-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { startTransition, useState } from 'react';
import { router } from '@inertiajs/react';
import { VFormField } from '@/components/vform';
import { useTableApi } from '@/components/data-table-2';

const schema = z.object({
  rejection_reason: z.string().min(10),
});

export function RejectForm() {
  const [open, setOpen] = useState(false);
  const invoice = useInvoice();
  const table = useTableApi();
  const form = useReactiveForm<z.infer<typeof schema>>({
    url: `/api/v1/invoices/${invoice!.id}/reject`,
    defaultValues: {
      rejection_reason: ''
    },
    resolver: zodResolver(schema),
  });

  function submit() {
    form.submit().then(() => {
      startTransition(() => {
        if (table) {
          table.reload();
        } else {
          router.reload();
        }
        setOpen(false);
      });
    });
  }

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      footer={
        <>
          <Button variant={'outline'} onClick={() => setOpen(false)}>Close</Button>
          <Button disabled={form.formState.isSubmitting} onClick={submit}>
            Submit
          </Button>
        </>
      }
      trigger={
        <Button variant={'destructive'} size={'sm'}>
          <XIcon /> Reject
        </Button>
      }
      title={'Reject invoice'}
      description={'Provide a reason for rejecting this invoice'}
    >
      <Form {...form}>
        <FormField
          control={form.control}
          render={
            ({ field }) => (
              <VFormField label={'Rejection Reason'}>
                <Textarea placeholder="Reason for rejection" {...field} />
              </VFormField>
            )
          }
          name={'rejection_reason'}
        />
      </Form>
    </DialogWrapper>
  );
}
