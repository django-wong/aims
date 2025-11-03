import Layout from '@/layouts/app-layout'
import { Head, router } from '@inertiajs/react';
import * as React from 'react';
import { BreadcrumbItem, Client } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMemo } from 'react';
import { Comments } from '@/components/comments';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash, UserRoundPen } from 'lucide-react';
import { TwoColumnLayout73 } from '@/components/main-content';
import { Info, InfoHead, InfoLine } from '@/components/info';
import { useQueryParam } from '@/hooks/use-query-param';
import { ClientForm } from '@/pages/clients/form';
import { useReactiveForm } from '@/hooks/use-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField } from '@/components/ui/form';
import { Loading } from '@/components/ui/loading';
import { useContactsTable } from '@/pages/contacts';
import { PopoverConfirm } from '@/components/popover-confirm';
import axios from 'axios';
import { ClientPermissionProvider, ClientProvider, useClientPermission } from '@/providers/client-provider';
import { Badge } from '@/components/ui/badge';
import { Impersonate } from '@/pages/clients/impersonate';

interface ClientEditProps {
  client: Client;
  can: {
    update: boolean;
  }
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Clients',
    href: route('clients'),
  }
];

export default function Edit(props: ClientEditProps) {
  const [hash, setHash] = useQueryParam('tab', 'contacts');

  return <>
    <ClientProvider value={props.client}>
      <ClientPermissionProvider value={props.can}>
        <Layout
          pageAction={
            props.can.update ? (
              <>
                <Impersonate userId={props.client.user_id}/>
                <PopoverConfirm
                  asChild
                  message={'Are you sure to delete this client? THis action cannot be undone.'}
                  onConfirm={
                    () => {
                      axios.delete(route('clients.destroy', { id: props.client.id }))
                        .then(() => {
                          router.visit(route('clients'));
                        })
                    }
                  }
                >
                  <Button variant={'destructive'}>
                    <Trash/> Delete
                  </Button>
                </PopoverConfirm>
                <ClientForm value={props.client} onSubmit={() => {router.reload()}}>
                  <Button variant={'primary'}>
                    <UserRoundPen/> Edit
                  </Button>
                </ClientForm>
              </>
            ) : <Badge variant={'destructive'}>Read Only</Badge>
          }
          breadcrumbs={[...breadcrumbs, {title: props.client.business_name, href: '.'}]}>
          <Head title={props.client.business_name}/>
          <TwoColumnLayout73
              left={
                <Tabs value={hash} onValueChange={setHash}>
                  <TabsList className={'mb-4'}>
                    <TabsTrigger value={'contacts'}>Contacts</TabsTrigger>
                    <TabsTrigger value={'notes'}>Notes</TabsTrigger>
                    <TabsTrigger value={'comments'}>Comments</TabsTrigger>
                  </TabsList>
                  <TabsContent value={'notes'}>
                    <NotesEditor client={props.client}/>
                  </TabsContent>
                  <TabsContent value={'contacts'}>
                    <ClientContacts client={props.client}/>
                  </TabsContent>
                  <TabsContent value={'comments'}>
                    <Comments commentableType={'Client'} commentableId={props.client.id} />
                  </TabsContent>
                </Tabs>
              }
              right={
                <Info>
                  <InfoHead>Client Profile</InfoHead>
                  <div>
                    <InfoLine label={'Business Name / Group'} icon={'book-user'}>
                      {props.client.business_name}
                    </InfoLine>
                    <InfoLine label={'Login '} icon={'book-user'}>
                      {props.client.user?.name ?? 'N/A'}
                    </InfoLine>
                    <InfoLine label="Coordinator" icon={'user-round-cog'}>
                      {props.client.coordinator?.name ?? 'N/A'}
                    </InfoLine>
                    <InfoLine label={'Reviewer'} icon={'glasses'}>
                      {props.client.reviewer?.name ?? 'N/A'}
                    </InfoLine>
                  </div>
                  <InfoHead>Address</InfoHead>
                  <p>
                    {props.client.address?.full_address ?? 'N/A'}
                  </p>
                </Info>
              }
            />
        </Layout>
      </ClientPermissionProvider>
    </ClientProvider>
  </>
}

interface NotesEditorProps {
  client: Client;
}

function NotesEditor(props: NotesEditorProps) {
  const permission = useClientPermission();

  const schema = useMemo(() => {
    return z.object({
      notes: z.string().max(5000, 'Notes must be less than 5000 characters.'),
    });
  }, []);

  const form = useReactiveForm<z.infer<typeof schema>>({
    url: route('clients.update', { id: props.client.id }),
    method: 'PUT',
    defaultValues: {
      notes: props.client.notes || '',
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
          {permission.update && (
            <div className={'flex justify-end'}>
              <Button type={'submit'}>
                <Loading show={form.formState.isSubmitting}/>
                Save notes
              </Button>
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}

interface ClientContactsProps {
  client: Client;
}

function ClientContacts(props: ClientContactsProps) {
  const permission = useClientPermission();

  const { content } = useContactsTable({
    contactable_id: props.client.id,
    contactable_type: 'client',
    readonly: !permission.update,
  });

  return <>{content}</>;
}
