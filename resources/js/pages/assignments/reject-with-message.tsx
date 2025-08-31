import { DialogWrapper } from '@/components/dialog-wrapper';
import { Form, FormField } from '@/components/ui/form';
import { useReactiveForm } from '@/hooks/use-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VFormField } from '@/components/vform';
import { Textarea } from '@/components/ui/textarea';
import { Undo2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { z } from 'zod';
import { DialogClose } from '@/components/ui/dialog';
import { Loading } from '@/components/ui/loading';
import { useAssignment } from '@/providers/assignment-provider';
import { startTransition, useState } from 'react';
import { AssignmentStatus } from '@/types';
import { router } from '@inertiajs/react';

const schema = z.object({
  message: z.string().min(10),
});

export function RejectWithMessage() {
  const assignment = useAssignment();

  const form = useReactiveForm<z.infer<typeof schema>>({
    url: `/api/v1/assignments/${assignment?.id}/reject`,
    defaultValues: {
      message: '',
    },
    resolver: zodResolver(schema),
  });

  const [open, setOpen] = useState(false);

  function submit() {
    form.submit().then(() => {
      startTransition(() => {
        form.reset();
        setOpen(false);
        router.reload();
      });
    });
  }

  return (
    <DialogWrapper
      open={open}
      onOpenChange={setOpen}
      title={'Reject Assignment'}
      description={'Please provide a reason or request for rejecting this assignment.'}
      footer={
        <>
          <DialogClose asChild>
            <Button variant={'outline'}>Close</Button>
          </DialogClose>
          <Button disabled={form.formState.isSubmitting} onClick={submit}>
            <Loading show={form.formState.isSubmitting} />
            Submit
          </Button>
        </>
      }
      trigger={
        <Button variant={'destructive'}>
          <Undo2Icon />
          Reject
        </Button>
      }
    >
      <Form {...form}>
        <div className={'grid grid-cols-12 gap-4'}>
          <FormField
            control={form.control}
            name={'message'}
            render={({ field }) => (
              <div className={'col-span-12'}>
                <VFormField label={'Message'}>
                  <Textarea value={field.value || ''} onChange={field.onChange} className={'min-h-36'} />
                </VFormField>
              </div>
            )}
          />
        </div>
      </Form>
    </DialogWrapper>
  );
}
