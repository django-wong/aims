import Layout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import * as React from 'react';
import { BreadcrumbItem, Client } from '@/types';
import { FlatLinkTabs, FlatLinkTabTrigger, FlatTabList, FlatTabs, FlatTabTrigger } from '@/components/ui/flat-tabs';
import { useLocationHash } from '@/hooks/use-location-hash';
import { TabsContent } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { PropsWithChildren } from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Car, Trash, UserRoundPen } from 'lucide-react';

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
  const [hash, setHash] = useLocationHash('details');

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
      breadcrumbs={[...breadcrumbs, {title: props.client.business_name, href: '#'}]}>
      <Head title="show"/>
      <div className={'px-6'}>
        <FlatTabs value={hash} onValueChange={setHash}>
          <FlatTabList>
            <FlatTabTrigger value={'details'}>Details</FlatTabTrigger>
            <FlatTabTrigger value={'contacts'}>Contacts</FlatTabTrigger>
            <FlatTabTrigger value={'assignments'}>Assignments</FlatTabTrigger>
          </FlatTabList>
          <TabsContent value={'details'}>
            <div>
              <div className={'flex flex-wrap'}>
                <div className={'flex min-w-[400px] flex-col'}>
                  <Line label={'Business Name / Group'}>
                    {props.client.business_name}
                  </Line>

                  <Line label="Coordinator">
                    {props.client.coordinator?.name ?? 'N/A'}
                  </Line>

                  <Line label={'Reviewer'}>
                    {props.client.reviewer?.name ?? 'N/A'}
                  </Line>

                  <Line label={'Address'}>
                    {props.client.address?.full_address ?? 'N/A'}
                  </Line>
                </div>
                <div className={'flex-1 flex flex-col gap-4'}>
                  <Textarea className={'min-h-54'} placeholder={'Notes...'} value={''} onChange={() => {}} />
                  <div className={'flex justify-end'}>
                    <Button>Save</Button>
                  </div>
                </div>
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
        </FlatTabs>
      </div>
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
