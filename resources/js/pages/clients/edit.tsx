import Layout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import * as React from 'react';
import { BreadcrumbItem, Client } from '@/types';
import { useLocationHash } from '@/hooks/use-location-hash';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropsWithChildren } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash, UserRoundPen } from 'lucide-react';
import { TwoColumnLayout73 } from '@/components/main-content';
import { Info, InfoHead, InfoLine } from '@/components/info';

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
  const [hash, setHash] = useLocationHash('notes');

  return <>
    <Layout
      pageAction={<>
        <Button size={'sm'} variant={'secondary'}>
          <Trash/> Delete
        </Button>
        <Button size={'sm'} variant={'secondary'}>
          <UserRoundPen/> Edit
        </Button>
      </>}
      breadcrumbs={[...breadcrumbs, {title: props.client.business_name, href: '.'}]}>
      <Head title={props.client.business_name}/>
      <TwoColumnLayout73
          left={
            <Tabs value={hash} onValueChange={setHash}>
              <TabsList className={'mb-6'}>
                <TabsTrigger value={'notes'}>Notes</TabsTrigger>
                <TabsTrigger value={'contacts'}>Contacts</TabsTrigger>
                <TabsTrigger value={'assignments'}>Assignments</TabsTrigger>
              </TabsList>
              <TabsContent value={'notes'}>
                <div className={'flex flex-col gap-4'}>
                  <Textarea className={'min-h-24 bg-background'} placeholder={'Notes...'} value={''} onChange={() => {}} />
                  <div className={'flex justify-end'}>
                    <Button>Save</Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value={'contacts'}>
                <Content>
                  All contacts for client {props.client.business_name} will be shown here.
                </Content>
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
              <InfoLine label={'Business Name / Group'} icon={'book-user'}>
                {props.client.business_name}
              </InfoLine>

              <InfoLine label="Coordinator" icon={'user-round-cog'}>
                {props.client.coordinator?.name ?? 'N/A'}
              </InfoLine>

              <InfoLine label={'Reviewer'} icon={'glasses'}>
                {props.client.reviewer?.name ?? 'N/A'}
              </InfoLine>

              <InfoLine label={'Address'} icon={'map-pin-house'}>
                {props.client.address?.full_address ?? 'N/A'}
              </InfoLine>
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


function Line(props: PropsWithChildren<{label: string}>) {
  return (
    <div className={'flex flex-col gap-1 mb-4'}>
      <div className={'text-muted-foreground text-sm'}>{props.label}</div>
      <div className={'text-foreground font-semibold'}>{props.children}</div>
    </div>
  )
}
