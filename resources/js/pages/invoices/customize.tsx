import { useInvoice } from '@/providers/invoice-provider';
import z from 'zod';
import { useReactiveForm } from '@/hooks/use-form';
import { Form, FormField } from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { VFormField } from '@/components/vform';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { router } from '@inertiajs/react';

const schema = z.object({
  title: z.string().optional(),
  sub_title: z.string().optional(),
  billing_name: z.string().optional(),
  billing_address: z.string().optional(),
  notes: z.string().optional(),
})

export function Customize() {
  const invoice = useInvoice();
  const form = useReactiveForm<z.infer<typeof schema>>({
    url: '/api/v1/invoices/' + invoice!.id,
    method: 'PUT',
    resolver: zodResolver(schema),
    defaultValues: {
      title: invoice!.title ?? '',
      sub_title: invoice!.sub_title ?? '',
      billing_name: invoice!.billing_name ?? '',
      billing_address: invoice!.billing_address ?? '',
      notes: invoice!.notes ?? '',
    }
  });

  function submit() {
    form.submit().then(() => {
      router.reload();
    })
  }

  return (
    <div>
      <Form {...form}>
        <div className={'grid grid-cols-1 gap-6'}>
          <FormField
            control={form.control}
            name={'title'}
            render={({field}) => (
              <VFormField label={'Invoice Title'}>
                <Input {...field} placeholder={'B.I.E Quality Services Pte Ltd'} />
              </VFormField>
            )}
          />
          <FormField
            control={form.control}
            name={'sub_title'}
            render={({field}) => (
              <VFormField label={'Sub Title'}>
                <Input {...field} />
              </VFormField>
            )}
          />
          <FormField
            control={form.control}
            name={'billing_name'}
            render={({field}) => (
              <VFormField label={'Billing Name (To)'}>
                <Input value={field.value} onChange={field.onChange}></Input>
              </VFormField>
            )}
          />
          <FormField
            control={form.control}
            name={'billing_address'}
            render={({field}) => (
              <VFormField label={'Billing Address'}>
                <Textarea value={field.value} onChange={field.onChange} rows={2}></Textarea>
              </VFormField>
            )}
          />
          <FormField
            control={form.control}
            name={'notes'}
            render={({field}) => (
              <VFormField label={'Notes'}>
                <Textarea value={field.value} onChange={field.onChange} rows={5}></Textarea>
              </VFormField>
            )}
          />

          <Button onClick={submit}>Save</Button>
        </div>
      </Form>
    </div>
  );
}
