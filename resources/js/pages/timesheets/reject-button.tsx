import { DialogWrapper } from '@/components/dialog-wrapper';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useReactiveForm } from '@/hooks/use-form';
import { useTimesheet } from '@/providers/timesheet-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { z } from 'zod';
import { DialogClose } from '@/components/ui/dialog';
import { Loading } from '@/components/ui/loading';
import { router } from '@inertiajs/react';
import { VFormField } from '@/components/vform';
import { useTableApi } from '@/components/data-table-2';

const schema = z.object({
  rejection_reason: z.string().min(5, 'Rejection reason must be at least 5 characters'),
});

export function RejectButton() {
  const timesheet = useTimesheet();

  const form = useReactiveForm<z.infer<typeof schema>>({
    url: `/api/v1/timesheets/${timesheet!.id}/reject`,
    resolver: zodResolver(schema),
  });

  const table = useTableApi();

  const [open, setOpen] = useState(false);

  function reject() {
    form.submit().then(() => {
      setOpen(false);
      router.reload();
      if (table) {
        table.reload();
      }
    });
  }

  return (
    <>
      <DialogWrapper
        open={open}
        onOpenChange={setOpen}
        trigger={
          <Button variant={'destructive'} size={'sm'} className={'contractor-holder-approve-button'}>
            <XIcon />
            Reject
          </Button>
        }
        title={'Reject the timesheet'}
        description={`Provide a reason for rejecting the timesheet #${timesheet?.id}`}
        footer={
          <>
            <DialogClose asChild>
              <Button variant={'outline'}>Cancel</Button>
            </DialogClose>
            <Button variant={'destructive'} onClick={reject} disabled={!form.formState.isValid}>
              <Loading show={form.formState.isSubmitting}/>
              Reject
            </Button>
          </>
        }
      >
        <Form {...form}>
          <FormField
            control={form.control}
            render={({ field }) => (
              <VFormField label={'Rejection Reason'} description={'Please be specific and clear.'}>
                <Textarea value={field.value ?? ''} onChange={field.onChange} />
              </VFormField>
            )}
            name={'rejection_reason'}
          />
        </Form>
      </DialogWrapper>
    </>
  );
}
