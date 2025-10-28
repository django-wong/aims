import { DialogWrapper } from '@/components/dialog-wrapper';
import { DialogFormProps, Quote } from '@/types';
import { Form, FormField } from '@/components/ui/form';
import { useReactiveForm, useResource } from '@/hooks/use-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { VFormField } from '@/components/vform';
import { ClientSelect } from '@/components/client-select';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { OrgSelect } from '@/components/org-select';
import { DatePicker } from '@/components/date-picker';
import { Button } from '@/components/ui/button';
import { DialogClose } from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useTableApi } from '@/components/data-table-2';
import { router } from '@inertiajs/react';

export function QuoteForm(props: DialogFormProps<Quote>) {
  const table = useTableApi();
  const form = useReactiveForm<z.infer<typeof schema>, Quote>({
    resolver: zodResolver(schema) as any,
    ...useResource('/api/v1/quotes', {
      serial_number: '',
      status: 2,
      type: 'quote',
      i_e_a: 'I',
      ...props.value
    })
  });

  const [open, setOpen] = useState(false);

  function submit() {
    form.submit().then((data) => {
      if (data) {
        form.resetAll();
        setOpen(false);
        props.onSubmit(data.data);
        if (table) {
          table.reload();
        } else {
          router.reload();
        }
      }
    }).catch(() => {});
  }

  useEffect(() => {
    form.resetAll(props.value);
  }, [props.value])

  return (
    <DialogWrapper open={open} onOpenChange={setOpen} footer={
      <>
        <DialogClose asChild>
          <Button variant={'outline'}>Close</Button>
        </DialogClose>
        <Button disabled={form.formState.isSubmitting} onClick={submit}>Submit</Button>
      </>
    } trigger={props.children} title={'Quote'} description={'Create or update the quote'}>
      <Form {...form}>
        <div className={'grid grid-cols-12 gap-4'}>
          <FormField
            control={form.control}
            render={({field}) => {
              return (
                <VFormField label={'Serial Number'} required className={'col-span-8'}>
                  <Input {...field}/>
                </VFormField>
              );
            }}
            name={'serial_number'}
          />
          <FormField
            control={form.control}
            render={({field}) => {
              return (
                <VFormField label={'Suffix'} className={'col-span-4'}>
                  <Input {...field} value={field.value || ''}/>
                </VFormField>
              );
            }}
            name={'suffix'}
          />
          <FormField
            control={form.control}
            render={({field}) => {
              return (
                <VFormField required label={'Type'} className={'col-span-12'}>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <SelectTrigger className={'bg-background w-full'}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="quote">Quote</SelectItem>
                      <SelectItem value="tender">Tender</SelectItem>
                      <SelectItem value="pre-qual">Pre Qual</SelectItem>
                      <SelectItem value="rates">Rates</SelectItem>
                    </SelectContent>
                  </Select>
                </VFormField>
              );
            }}
            name={'type'}
          />
          <FormField
            control={form.control}
            render={({field}) => {
              return (
                <VFormField label={'Client'} className={'col-span-6'}>
                  <ClientSelect onValueChane={(value) => {
                    field.onChange(value);
                  }} value={field.value || null}/>
                </VFormField>
              );
            }}
            name={'client_id'}
          />
          <FormField
            control={form.control}
            render={({field}) => {
              return (
                <VFormField label={'Quote Client'} className={'col-span-6'}>
                  <ClientSelect onValueChane={(value) => {
                    field.onChange(value);
                  }} value={field.value || null}/>
                </VFormField>
              );
            }}
            name={'quote_client_id'}
          />
          <FormField
            control={form.control}
            render={({field}) => {
              return (
                <VFormField label={'Client Ref'} className={'col-span-6'}>
                  <Input {...field} value={field.value || ''}/>
                </VFormField>
              );
            }}
            name={'client_ref'}
          />
          <FormField
            control={form.control}
            render={({field}) => {
              return (
                <VFormField required label={'I-E-A'} className={'col-span-6'}>
                  <Select onValueChange={field.onChange} value={field.value || ''}>
                    <SelectTrigger className={'bg-background w-full'}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="I">I</SelectItem>
                      <SelectItem value="E">E</SelectItem>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="IE">IE</SelectItem>
                      <SelectItem value="EA">EA</SelectItem>
                      <SelectItem value="IA">IA</SelectItem>
                      <SelectItem value="IEA">IEA</SelectItem>
                    </SelectContent>
                  </Select>
                </VFormField>
              );
            }}
            name={'i_e_a'}
          />
          <FormField
            control={form.control}
            render={({field}) => {
              return (
                <VFormField label={'Details'} className={'col-span-12'}>
                  <Textarea {...field} value={field.value || ''} rows={3}/>
                </VFormField>
              );
            }}
            name={'details'}
          />
          <FormField
            control={form.control}
            render={({field}) => {
              return (
                <VFormField label={'Controlling Office'} className={'col-span-12'}>
                  <OrgSelect
                    onValueChane={field.onChange}
                    value={field.value || null}
                  />
                </VFormField>
              );
            }}
            name={'controlling_org_id'}
          />
          <FormField
            control={form.control}
            render={({field}) => {
              return (
                <VFormField label={'Received Date'} className={'col-span-4'}>
                  <DatePicker
                      value={field.value || undefined}
                      onChange={(date) => {
                        field.onChange(date ? dayjs(date).format('YYYY/MM/DD') : null)
                      }}
                    />
                </VFormField>
              );
            }}
            name={'received_date'}
          />
          <FormField
            control={form.control}
            render={({field}) => {
              return (
                <VFormField label={'Due Date'} className={'col-span-4'}>
                  <DatePicker
                      value={field.value || undefined}
                      onChange={(date) => {
                        field.onChange(
                          date ? dayjs(date).format('YYYY/MM/DD') : null
                        )
                      }}
                    />
                </VFormField>
              );
            }}
            name={'due_date'}
          />
          <FormField
            control={form.control}
            render={({field}) => {
              return (
                <VFormField label={'Despatched Date'} className={'col-span-4'}>
                  <DatePicker
                      value={field.value || undefined}
                      onChange={(date) => {
                        field.onChange(date ? dayjs(date).format('YYYY/MM/DD') : null)
                      }}
                    />
                </VFormField>
              );
            }}
            name={'despatched_date'}
          />
          <FormField
            control={form.control}
            render={({field}) => {
              return (
                <VFormField label={'Passed to User'} className={'col-span-12'}>
                  <Input {...field} value={field.value || ''}/>
                </VFormField>
              );
            }}
            name={'pass_to_user'}
          />
          <FormField
            control={form.control}
            render={({field}) => {
              return (
                <VFormField label={'Status'} className={'col-span-12'}>
                  <Select onValueChange={field.onChange} value={field.value?.toString() || ''}>
                    <SelectTrigger className={'bg-background w-full'}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Won</SelectItem>
                      <SelectItem value="1">Lost</SelectItem>
                      <SelectItem value="2">Not Advised</SelectItem>
                      <SelectItem value="3">Waiting</SelectItem>
                      <SelectItem value="4">Declined</SelectItem>
                    </SelectContent>
                  </Select>
                </VFormField>
              );
            }}
            name={'status'}
          />
          <FormField
            control={form.control}
            render={({field}) => {
              return (
                <VFormField label={'Notes'} className={'col-span-12'}>
                  <Textarea value={field.value ?? ''} onChange={field.onChange} rows={5}/>
                </VFormField>
              );
            }}
            name={'notes'}
          />
        </div>
      </Form>
    </DialogWrapper>
  );
}

const schema = z.object({
  suffix: z.string().optional().nullable(),
  serial_number: z.string().min(1, 'Serial Number is required'),
  i_e_a: z.string(),
  type: z.string('Type is required'),
  client_id: z.coerce.number().optional().nullable(),
  client_ref: z.string().optional().nullable(),
  details: z.string().optional().nullable(),
  controlling_org_id: z.coerce.number().optional().nullable(),
  received_date: z.string().nullable().optional(),
  pass_to_user: z.string().optional().nullable(),
  due_date: z.string().nullable().optional(),
  despatched_date: z.string().nullable().optional(),
  status: z.coerce.number(),
  notes: z.string().optional().nullable(),
  quote_client_id: z.coerce.number().optional().nullable(),
})
