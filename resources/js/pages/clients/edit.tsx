import Layout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import * as React from 'react';
import { BreadcrumbItem, Client } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropsWithChildren, useMemo } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash, UserRoundPen } from 'lucide-react';
import { TwoColumnLayout73 } from '@/components/main-content';
import { Info, InfoHead, InfoLine, InfoLineValue } from '@/components/info';
import { useQueryParam } from '@/hooks/use-query-param';
import { ClientForm } from '@/pages/clients/form';
import { useReactiveForm } from '@/hooks/use-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormField } from '@/components/ui/form';
import { Loading } from '@/components/ui/loading';
import { useContactsTable } from '@/pages/contacts';

interface ClientEditProps {
  client: Client;
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
  const [hash, setHash] = useQueryParam('tab', 'notes');

  return <>
    <Layout
      pageAction={<>
        <Button size={'sm'} variant={'secondary'}>
          <Trash/> Delete
        </Button>
        <ClientForm value={props.client} onSubmit={() => {}}>
          <Button size={'sm'} variant={'secondary'}>
            <UserRoundPen/> Edit
          </Button>
        </ClientForm>
      </>}
      breadcrumbs={[...breadcrumbs, {title: props.client.business_name, href: '.'}]}>
      <Head title={props.client.business_name}/>
      <TwoColumnLayout73
          left={
            <Tabs value={hash} onValueChange={setHash}>
              <TabsList className={'mb-4'}>
                <TabsTrigger value={'notes'}>Notes</TabsTrigger>
                <TabsTrigger value={'contacts'}>Contacts</TabsTrigger>
                <TabsTrigger value={'assignments'}>Assignments</TabsTrigger>
              </TabsList>
              <TabsContent value={'notes'}>
                <NotesEditor client={props.client}/>
              </TabsContent>
              <TabsContent value={'contacts'}>
                <ClientContacts client={props.client}/>
              </TabsContent>
              <TabsContent value={'assignments'}>
                <Content>
                  Here will show the list of assignments for client {props.client.business_name}.
                </Content>
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
  </>
}


function Content(props: PropsWithChildren) {
  return (
    <div className={'h-[40vh] flex justify-center items-center bg-muted/40 rounded-lg outline-2 outline-dashed outline-border'}>
      { props.children }
    </div>
  )
}


interface NotesEditorProps {
  client: Client;
}

function NotesEditor(props: NotesEditorProps) {
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

interface ClientContactsProps {
  client: Client;
}

function ClientContacts(props: ClientContactsProps) {
  const { content } = useContactsTable({
    contactable_id: props.client.id,
    contactable_type: 'client',
  });

  return <>{content}</>;
}
