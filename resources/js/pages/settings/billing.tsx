import * as z from 'zod';
import { Head } from '@inertiajs/react';

import HeadingSmall from '@/components/heading-small';
import { type BreadcrumbItem, Org } from '@/types';

import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { useReactiveForm } from '@/hooks/use-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField } from '@/components/ui/form';
import { VFormField } from '@/components/vform';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loading } from '@/components/ui/loading';
import { Input } from '@/components/ui/input';

const schema = z.object({
  abn: z.string().optional(),
  billing_name: z.string().optional(),
  billing_address: z.string().optional(),
  billing_statement: z.string().optional(),
});

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Billing',
    href: '/settings/billing',
  },
];

interface BillingProps {
  org: Org;
}

export default function Billing(props: BillingProps) {
  const form = useReactiveForm<z.infer<typeof schema>, Org>({
    url: `/api/v1/orgs/${props.org.id}`,
    method: 'PUT',
    defaultValues: {
      abn: props.org.abn || '',
      billing_statement: props.org.billing_statement || '',
      billing_name: props.org.billing_name || '',
      billing_address: props.org.billing_address || '',
    },
    resolver: zodResolver(schema),
  });
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Billing" />
      <SettingsLayout>
        <div className="space-y-6">
          <HeadingSmall title="Billing" description="Update your account's billing information" />
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit((data) => {
                form.submit().then((res) => {
                  console.info([res, data]);
                });
              })}>
              <div className={'grid grid-cols-1 gap-6'}>
                <FormField
                  render={({field}) => {
                    return (
                      <VFormField
                        label="ABN">
                        <Input value={field.value} onChange={field.onChange}/>
                      </VFormField>
                    );
                  }}
                  control={form.control}
                  name={'abn'}
                />

                <FormField
                  render={({field}) => {
                    return (
                      <VFormField
                        description={'Appear on invoices that other office send you.'}
                        label="Billing Name">
                        <Input value={field.value} onChange={field.onChange}/>
                      </VFormField>
                    );
                  }}
                  control={form.control}
                  name={'billing_name'}
                />
                <FormField
                  render={({field}) => {
                    return (
                      <VFormField
                        label="Billing Address">
                        <Textarea value={field.value} onChange={field.onChange}/>
                      </VFormField>
                    );
                  }}
                  control={form.control}
                  name={'billing_address'}
                />
                <FormField
                  render={({field}) => {
                    return (
                      <VFormField
                        description='This statement will appear on your invoices.'
                        label="Billing Statement">
                        <Textarea value={field.value} onChange={field.onChange} placeholder={'Bank Account: xxxx'}/>
                      </VFormField>
                    );
                  }}
                  control={form.control}
                  name={'billing_statement'}
                />
                <div className={'flex justify-start gap-4'}>
                  <Button type={'reset'} variant={'outline'} onClick={() => form.reset()}>Reset</Button>
                  <Button type={'submit'}>
                    {form.formState.isSubmitting ? (
                      <Loading show={true}/>
                    ) : 'Save'}
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </SettingsLayout>
    </AppLayout>
  );
}
