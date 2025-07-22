import Layout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import * as React from 'react';
import { BreadcrumbItem, Client } from '@/types';
import { FlatTabList, FlatTabs, FlatTabTrigger } from '@/components/ui/flat-tabs';
import { useLocationHash } from '@/hooks/use-location-hash';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PropsWithChildren } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash, UserRoundPen } from 'lucide-react';

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
      breadcrumbs={[...breadcrumbs, {title: props.client.business_name, href: '#'}]}>
      <Head title="show"/>
      <div className={'px-6'}>
        <Tabs value={hash} onValueChange={setHash}>
          <TabsList>
            <TabsTrigger value={'notes'}>Notes</TabsTrigger>
            <TabsTrigger value={'contacts'}>Contacts</TabsTrigger>
            <TabsTrigger value={'assignments'}>Assignments</TabsTrigger>
          </TabsList>
          <div className={'mt-4'}>
            <div>
              <div className={'flex flex-wrap gap-8'}>
                <div className={'flex-1'}>
                  <TabsContent value={'notes'}>
                    <div className={'flex flex-col gap-4 bg-muted/50 p-2 rounded-lg border-border/30 border'}>
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
                </div>
                <div className={'flex min-w-[400px] flex-col'}>
                  <h1 className={'font-bold text-xl mb-4'}>Client Profile</h1>
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
              </div>
            </div>
          </div>
        </Tabs>
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
