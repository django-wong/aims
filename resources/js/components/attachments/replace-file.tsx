import { DialogWrapper } from '@/components/dialog-wrapper';
import { Attachment, DialogFormProps } from '@/types';
import { z } from 'zod';
import { objectToFormData, useReactiveForm } from '@/hooks/use-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField } from '@/components/ui/form';
import { VFormField } from '@/components/vform';
import { Input } from '@/components/ui/input';
import { DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useTableApi } from '@/components/data-table-2';
import { useState } from 'react';

export function ReplaceFile(props: DialogFormProps<Attachment>) {
  const form = useReactiveForm<z.infer<typeof schema>, Attachment>({
    url: `/api/v1/attachments/${props.value?.id ?? ''}`,
    resolver: zodResolver(schema),
    serialize: objectToFormData,
    method: 'PUT',
  });

  const [open, setOpen] = useState(false);

  const table = useTableApi();

  if (! props.value) {
    return null;
  }

  function submit() {
    form.submit().then((res) => {
      if (res) {
        setOpen(false);
        props.onSubmit?.(res.data);
        if (table) {
          table.reload()
        }
      }
    });
  }

  return (
    <>
      <DialogWrapper
        footer={
          <>
            <DialogClose asChild>
              <Button variant={'outline'}>Cancel</Button>
            </DialogClose>
            <Button onClick={submit}>
              Submit
            </Button>
          </>
        }
        trigger={props.children} title={'Replace File'} description={'Replace the attachment file'}
        open={open}
        onOpenChange={setOpen}>
        <Form {...form}>
          <div className={'grid grid-cols-12 gap-4'}>
            <FormField
              control={form.control}
              render={({field}) => {
                return (
                  <VFormField className={'w-full col-span-12'} label={'Attachment'}>
                    <Input type={'file'} onChange={(event) => field.onChange(Array.from(event.target.files ?? []).pop())} />
                  </VFormField>
                );
              }}
              name={'attachment'}
            />
          </div>
        </Form>
      </DialogWrapper>
    </>
  );
}

const schema = z.object({
  attachment: z.instanceof(File).describe('The new attachment file')
});
