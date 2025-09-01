import Layout from '@/layouts/app-layout'
import { Head, router } from '@inertiajs/react';
import * as React from 'react';
import { BreadcrumbItem, Vendor } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash, UserRoundPen } from 'lucide-react';
import { TwoColumnLayout73 } from '@/components/main-content';
import { Info, InfoHead, InfoLine } from '@/components/info';
import { useQueryParam } from '@/hooks/use-query-param';
import { VendorForm } from '@/pages/vendors/form';
import { useReactiveForm } from '@/hooks/use-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField } from '@/components/ui/form';
import { Loading } from '@/components/ui/loading';
import { useContactsTable } from '@/pages/contacts';
import { PopoverConfirm } from '@/components/popover-confirm';
import axios from 'axios';
import { useOrg } from '@/hooks/use-org';
import { useRole } from '@/hooks/use-role';

interface VendorEditProps {
  vendor: Vendor;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Vendors',
    href: route('vendors'),
  }
];

export default function Edit(props: VendorEditProps) {
  const [hash, setHash] = useQueryParam('tab', 'notes');

  return <>
    <Layout
      pageAction={<>
        <PopoverConfirm message={'Are you sure to delete this vendor?'}
          onConfirm={() => {
            axios.delete('/api/v1/vendors/' + props.vendor.id).then(() => {
              router.visit(route('vendors'))
            })
          }}
        >
          <Button size={'sm'} variant={'secondary'}>
            <Trash/> Delete
          </Button>
        </PopoverConfirm>
        <VendorForm value={props.vendor} onSubmit={() => {router.reload()}}>
          <Button size={'sm'} variant={'secondary'}>
            <UserRoundPen/> Edit
          </Button>
        </VendorForm>
      </>}
      breadcrumbs={[...breadcrumbs, {title: props.vendor.business_name, href: '.'}]}>
      <Head title={props.vendor.business_name}/>
      <TwoColumnLayout73
          left={
            <Tabs value={hash} onValueChange={setHash}>
              <TabsList className={'mb-4'}>
                <TabsTrigger value={'notes'}>Notes</TabsTrigger>
                <TabsTrigger value={'contacts'}>Contacts</TabsTrigger>
              </TabsList>
              <TabsContent value={'notes'}>
                <NotesEditor vendor={props.vendor}/>
              </TabsContent>
              <TabsContent value={'contacts'}>
                <VendorContacts vendor={props.vendor}/>
              </TabsContent>
            </Tabs>
          }
          right={
            <Info>
              <InfoHead>About</InfoHead>
              <div>
                <InfoLine label={'Business Name / Group'} icon={'book-user'}>
                  {props.vendor.business_name}
                </InfoLine>
              </div>
              <InfoHead>Address</InfoHead>
              <p>
                {props.vendor.address?.full_address ?? 'N/A'}
              </p>
            </Info>
          }
        />
    </Layout>
  </>
}

interface NotesEditorProps {
  vendor: Vendor;
}

function NotesEditor(props: NotesEditorProps) {
  const schema = useMemo(() => {
    return z.object({
      notes: z.string().max(5000, 'Notes must be less than 5000 characters.'),
    });
  }, []);

  const form = useReactiveForm<z.infer<typeof schema>>({
    url: route('vendors.update', { id: props.vendor.id }),
    method: 'PUT',
    defaultValues: {
      notes: props.vendor.notes || '',
    },
    resolver: zodResolver(schema)
  });

  return (
    <Form {...form}>
      <form onSubmit={form.submit}>
        <div className={'flex flex-col gap-4'}>
          <FormField
            control={form.control}
            render={({field}) => (
              <Textarea className={'min-h-36 bg-background'} placeholder={'Notes...'} {...field} />
            )}
            name={'notes'}
          />
          <div className={'flex justify-end'}>
            <Button type={'submit'}>
              <Loading show={form.formState.isSubmitting}/>
              Save notes
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}

interface VendorContactsProps {
  vendor: Vendor;
}

function VendorContacts(props: VendorContactsProps) {
  const role = useRole();
  const org = useOrg();

  const readonly = props.vendor.org_id != org!.id || [1,2,3,4,8].indexOf(role!) === -1

  const { content } = useContactsTable({
    contactable_id: props.vendor.id,
    contactable_type: 'vendor',
    readonly: readonly
  });

  return <>{content}</>;
}
