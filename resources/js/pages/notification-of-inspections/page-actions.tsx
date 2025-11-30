import { Button } from '@/components/ui/button';
import { useNotificationOfInspection } from '@/providers/notification-of-inspection-provider';
import axios from 'axios';
import { useIsClient } from '@/hooks/use-role';
import { useReload } from '@/hooks/use-reload';
import { useState } from 'react';
import { Loading } from '@/components/ui/loading';
import { DialogClose, DialogWrapper } from '@/components/dialog-wrapper';
import { Form, FormField } from '@/components/ui/form';
import { useReactiveForm } from '@/hooks/use-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import { VFormField } from '@/components/vform';
import DateTimePicker from '@/components/date-picker/date-time-picker';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon } from 'lucide-react';

export function NotificationOfInspectionPageAction() {
  return (
    <div className={'flex items-center gap-2 justify-end'}>
      <Send/>
      <Accept/>
      <Reject/>
    </div>
  );
}


function Accept() {
  const subject = useNotificationOfInspection();
  const is_client = useIsClient();
  const reload = useReload();

  const [loading, setLoading] = useState(false);

  if (!subject) {
    return null;
  }

  if (is_client) {
    if (![3].includes(subject.status)) {
      return null;
    }
  } else {
    if (![1, 4].includes(subject.status)) {
      return null;
    }
  }

  function accept() {
    setLoading(true);
    axios.post('/api/v1/notification-of-inspections/' + subject!.id + '/accept').then(reload).finally(() => {
      setLoading(false);
    });
  }

  return (
    <Button onClick={accept} disabled={loading}>
      <Loading show={loading}/>
      Accept
    </Button>
  );
}

function Send() {
  const subject = useNotificationOfInspection();
  const is_client = useIsClient();
  const [loading, setLoading] = useState(false);
  const reload = useReload();

  if (!subject) {
    return null;
  }

  if (!is_client || ![0, 1].includes(subject.status)) {
    return null;
  }

  function send() {
    setLoading(true);
    axios.post('/api/v1/notification-of-inspections/' + subject!.id + '/send').then(reload).finally(() => {
      setLoading(false);
    });
  }

  return (
    <Button onClick={send} disabled={loading}>
      <SendIcon/> Send {subject.status > 0 ? 'Again' : ''}
    </Button>
  );
}

const schema = z.object({
  proposed_from: z.string().optional().nullable(),
  proposed_to: z.string().optional().nullable(),
  rejection_reason: z.string().min(10, 'Reason must be at least 10 characters long'),
}).refine(
  (data) => {
    if (data.proposed_from && data.proposed_to) {
      return new Date(data.proposed_from) <= new Date(data.proposed_to);
    }
    return true;
  },
  {
    message: 'Invalid date range',
    path: ['proposed_to'],
  },
);

function Reject() {
  const subject = useNotificationOfInspection();
  const is_client = useIsClient();
  const reload = useReload();

  const form = useReactiveForm<z.infer<typeof schema>>({
    url: '/api/v1/notification-of-inspections/' + subject?.id + '/reject',
    resolver: zodResolver(schema) as any,
    defaultValues: {
      proposed_from: '',
      proposed_to: '',
      rejection_reason: ''
    }
  });

  const [open, setOpen] = useState(false);

  if (!subject) {
    return null;
  }

  if (is_client) {
    if (![3].includes(subject.status)) {
      return null;
    }
  } else {
    if (![1, 4].includes(subject.status)) {
      return null;
    }
  }

  function reject() {
    form.submit().then(() => {
      setOpen(false);
      reload();
    })
  }

  const footer = <>
    <DialogClose asChild>
      <Button variant={'outline'}>Close</Button>
    </DialogClose>
    <Button onClick={reject} disabled={form.formState.isSubmitting}>
      Submit
    </Button>
  </>

  return (
    <DialogWrapper open={open} onOpenChange={setOpen} footer={footer} trigger={<Button variant={'destructive'}>Propose New Time</Button>} title={'Reject Notification of Inspection'} description={'You can propose a new time for the inspection by filling out the form below.'}>
      <Form {...form}>
        <div className={'grid grid-cols-12 gap-6'}>
          <FormField
            control={form.control}
            name={'proposed_from'}
            render={({field}) => (
              <VFormField label={'From'} className={'col-span-6'}>
                <DateTimePicker value={field.value} onChange={field.onChange}/>
              </VFormField>
            )}
          />
          <FormField
            control={form.control}
            name={'proposed_to'}
            render={({field}) => (
              <VFormField label={'To'} className={'col-span-6'}>
                <DateTimePicker value={field.value} onChange={field.onChange}/>
              </VFormField>
            )}
          />
          <FormField
            control={form.control}
            name={'rejection_reason'}
            render={({field}) => (
              <VFormField label={'Reason for Rejection'} className={'col-span-12'} required>
                <Textarea {...field} className={'input w-full h-32'} />
              </VFormField>
            )}
          />
        </div>
      </Form>
    </DialogWrapper>
  );
}
