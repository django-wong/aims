import { z } from 'zod';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAssignment } from '@/providers/assignment-provider';
import { DialogWrapper, DialogClose } from '@/components/dialog-wrapper';
import { DialogFormProps, NotificationOfInspection } from '@/types';
import { objectToFormData, useReactiveForm } from '@/hooks/use-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField } from '@/components/ui/form';
import { VFormField } from '@/components/vform';
import { Input } from '@/components/ui/input';
import { MapPinIcon } from 'lucide-react';

import { AssignmentInspectorSelect } from '@/pages/assignments/assignment-inspector-select';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Textarea } from '@/components/ui/textarea';
import { AssignmentSelect } from '@/components/assignment-select';
import { useReload } from '@/hooks/use-reload';
import DateTimePicker from '@/components/date-picker/date-time-picker';

const schema = z.object({
  assignment_id: z.number(),
  from: z.string('Invalid date').nonempty(),
  to: z.string('Invalid date').nonempty(),
  inspector_id: z.coerce.number('Inspector is required').min(1, 'Inspector is required'),
  location: z.string().optional().nullable(),
  description: z.string().optional(),
  attachments: z.array(z.file()).optional()
}).refine(
  (data) => {
    if (data.from && data.to) {
      return new Date(data.from) <= new Date(data.to);
    }
    return true;
  },
  {
    message: 'Invalid date range',
    path: ['to'],
  },
);

export function NotificationOfInspectionForm(props: DialogFormProps<NotificationOfInspection>) {
  const [open, setOpen] = useState(props.open ?? false);
  const assignment = useAssignment();
  const reload = useReload();

  const form = useReactiveForm<z.infer<typeof schema>, NotificationOfInspection>({
    url: '/api/v1/notification-of-inspections',
    method: 'POST',
    resolver: zodResolver(schema) as any,
    serialize: objectToFormData,
    defaultValues: {
      assignment_id: assignment?.id ?? props.value?.assignment_id,
      from: props.value?.from ?? '',
      to: props.value?.to ?? '',
      inspector_id: props.value?.inspector_id,
      location: props.value?.location ?? '',
      description: props.value?.description ?? '',
      attachments: []
    }
  });

  useEffect(() => {
    setOpen(props.open ?? false);
  }, [props.open]);

  const assignment_id = form.watch('assignment_id');

  function submit() {
    form.submit().then(res => {
      if (res) {
        props.onSubmit?.(res.data);
        reload();
        setOpen(false);
        props.onOpenChange?.(false);
      }
    })
  }

  return (
    <DialogWrapper
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        props.onOpenChange?.(open);
      }}
      footer={
        <>
          <DialogClose asChild>
            <Button variant={'outline'}>Close</Button>
          </DialogClose>
          <Button onClick={submit} disabled={form.formState.isSubmitting}>Send</Button>
        </>
      }
      trigger={props.children}
      title={'Notification of Inspection'}
      description={'Fill out the form below to request an new inspection.'}>
      <Form {...form}>
        <div className={'grid grid-cols-12 gap-6'}>
          {
            assignment ? null : (
              <FormField
                name={'assignment_id'}
                control={form.control}
                render={({field}) => (
                  <VFormField label={'Assignment'} className={'col-span-12'} required>
                    <AssignmentSelect onValueChane={field.onChange} value={field.value}/>
                  </VFormField>
                )}
              />
            )
          }
          <FormField
            control={form.control}
            name={'from'}
            render={({field}) => (
              <VFormField label={'From'} className={'col-span-6'} required>
                <DateTimePicker value={field.value} onChange={field.onChange}/>
              </VFormField>
            )}
          />
          <FormField
            control={form.control}
            name={'to'}
            render={({field}) => (
              <VFormField label={'To'} className={'col-span-6'} required>
                <DateTimePicker value={field.value} onChange={field.onChange}/>
              </VFormField>
            )}
          />
          <FormField
            control={form.control}
            name={'inspector_id'}
            render={({field}) => (
              <VFormField label={'Inspector'} className={'col-span-12'} required>
                <AssignmentInspectorSelect
                  assignmentId={assignment_id}
                  value={field.value}
                  onChange={field.onChange}
                />
              </VFormField>
            )}
          />
          <FormField
            control={form.control}
            name={'location'}
            render={({field}) => (
              <VFormField label={'Location'} className={'col-span-12'}>
                <InputGroup>
                  <InputGroupInput {...field} value={field.value ?? ''}  placeholder={'e.g. Building A, 2nd Floor'}/>
                  <InputGroupAddon align={'inline-end'}>
                    <MapPinIcon/>
                  </InputGroupAddon>
                </InputGroup>
              </VFormField>
            )}
          />
          <FormField
            control={form.control}
            name={'description'}
            render={({field}) => (
              <VFormField label={'Description'} className={'col-span-12'}>
                <Textarea {...field}/>
              </VFormField>
            )}
          />
          <FormField
            control={form.control}
            render={({ field }) => {
              return (
                <>
                  <VFormField label={'Attachments'} className={'col-span-12'}>
                    <Input
                      type="file"
                      multiple
                      accept={'*'}
                      onChange={(event) => {
                        field.onChange(Array.from(event.target.files ?? []));
                      }}
                    />
                  </VFormField>
                </>
              );
            }}
            name={'attachments'}
          />
        </div>
      </Form>
    </DialogWrapper>
  );
}
