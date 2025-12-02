import { DialogFormProps } from '@/types';
import { DialogClose, DialogWrapper } from '@/components/dialog-wrapper';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import z from 'zod';
import { objectToFormData, useReactiveForm } from '@/hooks/use-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTimesheet } from '@/providers/timesheet-provider';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { VFormField } from '@/components/vform';
import { Button } from '@/components/ui/button';
import { useReload } from '@/hooks/use-reload';
import axios from 'axios';
import { useState } from 'react';

const schema = z.object({
  attachment: z.file()
});

export function UploadSignedCopy(props: DialogFormProps) {
  const timesheet = useTimesheet();

  const reload = useReload();

  const form = useReactiveForm({
    url: `/api/v1/timesheets/${timesheet?.id}/upload-signed-copy`,
    resolver: zodResolver(schema) as any,
    serialize: objectToFormData,
    method: 'POST'
  });

  const [removing, setRemoving] = useState(false);

  function submit() {
    form.submit().then(() => {
      reload();
      props.onOpenChange?.(false);
    })
  }

  function remove() {
    setRemoving(true);
    axios.delete('/api/v1/timesheets/' + timesheet?.id + '/remove-signed-copy').then(() => {
      reload();
      props.onOpenChange?.(false);
    }).finally(() => {
      setRemoving(false);
    })
  }

  const footer = (
    <div className={'flex justify-between w-full items-center'}>
      <Button variant={'destructive'} onClick={remove} disabled={removing}>
        {removing ? 'Removing...' : 'Remove signed copy'}
      </Button>
      <div className={'flex gap-4'}>
        <DialogClose asChild>
          <Button variant={'outline'}>Close</Button>
        </DialogClose>
        <Button onClick={submit}>Submit</Button>
      </div>
    </div>
  );
  return (
    <DialogWrapper open={props.open} onOpenChange={props.onOpenChange} footer={footer} trigger={null} title={'Upload a signed copy'} description={'This will replace the system generated PDF with your signed copy.'}>
      <Form {...form}>
        <div className={'grid grid-cols-1 gap-6'}>
          <Alert variant={'destructive'}>
            <AlertCircleIcon />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
              Uploading a signed copy will override the existing PDF timesheet. Ensure that the signed document is accurate and complete before proceeding as it will be attached to the client facing invoice.
            </AlertDescription>
          </Alert>
          <FormField
            control={form.control}
            name="attachment"
            render={({field}) => {
              return (
                <VFormField label={'File'} required>
                  <Input
                    type={'file'} onChange={(event) => {
                      const file = event.target.files?.[0];
                      field.onChange(file);
                    }}
                    required accept="application/pdf,image/jpeg,image/png"
                  />
                </VFormField>
              )
            }}
          />
        </div>
      </Form>
    </DialogWrapper>
  );
}
