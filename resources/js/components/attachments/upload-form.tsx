import { DialogWrapper } from '@/components/dialog-wrapper';
import { z } from 'zod';
import { useReactiveForm } from '@/hooks/use-form';
import { useAttachable } from '@/providers/attachable-provider';
import { zodResolver } from '@hookform/resolvers/zod';
import { toFormData } from 'axios';
import { Form, FormField } from '@/components/ui/form';
import { VFormField } from '@/components/vform';
import { Input } from '@/components/ui/input';
import { DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { UploadIcon } from 'lucide-react';
import { useState } from 'react';

export interface UploadFormProps {
  children: React.ReactNode;
  onUploadComplete?: () => void;
}

const schema = z.object({
  attachments: z.array(
    z.file()
  ),
  attachable_id: z.number().optional(),
  attachable_type: z.string().optional(),
  group: z.string().optional()
})

export function UploadForm(props: UploadFormProps) {
  const [open, setOpen] = useState(false);

  const attachable = useAttachable();

  const form = useReactiveForm<z.infer<typeof schema>>({
    url: '/api/v1/attachments',

    serialize: (data) => {
      return toFormData(data);
    },

    defaultValues: {
      ...attachable
    },
    resolver: zodResolver(schema) as any
  });

  function upload() {
    form.submit().then(() => {
      props.onUploadComplete?.();
      setOpen(false);
    })
  }

  const footer = (
    <>
      <DialogClose>
        <Button variant={'outline'}>Close</Button>
      </DialogClose>
      <Button onClick={upload}>
        <UploadIcon/> Upload
      </Button>
    </>
  );

  return (
    <>
      <DialogWrapper open={open} onOpenChange={setOpen} trigger={props.children} title={'Upload Attachment'} description={'Select a files'} footer={footer}>
        <Form {...form}>
          <div className={'grid grid-cols-12 gap-4'}>
            <FormField
              control={form.control}
              render={({field}) => {
                return (
                  <VFormField className={'w-full col-span-12'} label={'Attachments'}>
                    <Input type={'file'} multiple onChange={(event) => field.onChange(Array.from(event.target.files ?? []))} />
                  </VFormField>
                );
              }}
              name={'attachments'}
            />
          </div>
        </Form>
      </DialogWrapper>
    </>
  );
}
