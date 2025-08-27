import { PopoverConfirm } from '@/components/popover-confirm';
import { Button } from '@/components/ui/button';
import Layout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { Trash, UserRoundPen } from 'lucide-react';
import { InspectorForm } from '@/pages/inspectors';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, InfoHead, InfoLine } from '@/components/info';
import { TwoColumnLayout73 } from '@/components/main-content';
import * as React from 'react';
import { useLocationHash } from '@/hooks/use-location-hash';

interface InspectorEditProps {
  inspector: User;
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Inspectors',
    href: route('inspectors'),
  },
];

export default function EditPage(props: InspectorEditProps) {
  const [hash, setHash] = useLocationHash('skills');

  return (
    <Layout
      pageAction={
        <>
          <PopoverConfirm
            asChild
            message={'Are you sure to delete this inspector? THis action cannot be undone.'}
            onConfirm={() => {
              axios.delete(route('users.destroy', { id: props.inspector.id })).then(() => {
                router.visit(route('inspectors'));
              });
            }}
          >
            <Button size={'sm'} variant={'secondary'}>
              <Trash /> Delete
            </Button>
          </PopoverConfirm>
          <InspectorForm
            value={props.inspector}
            onSubmit={() => {
              window.location.reload();
            }}
          >
            <Button size={'sm'} variant={'secondary'}>
              <UserRoundPen /> Edit
            </Button>
          </InspectorForm>
        </>
      }
      breadcrumbs={[...breadcrumbs, { title: props.inspector.name, href: '.' }]}
    >
      <Head title={props.inspector.name}/>
      <TwoColumnLayout73
          left={
            <Tabs value={hash} onValueChange={setHash}>
              <TabsList className={'mb-4'}>
                <TabsTrigger value={'skills'}>Skills</TabsTrigger>
                <TabsTrigger value={'certificates'}>Certificates</TabsTrigger>
              </TabsList>
              <TabsContent value={'skills'}>

              </TabsContent>
              <TabsContent value={'certificates'}>

              </TabsContent>
            </Tabs>
          }
          right={
            <Info>
              <InfoHead>Info</InfoHead>
              <div>
                <InfoLine label={'Business Name / Group'} icon={'book-user'}>
                  {props.inspector.name}
                </InfoLine>
                <InfoLine label={'Address'} icon={'map-pin'}>
                  {props.inspector.address?.full_address ?? 'N/A'}
                </InfoLine>
              </div>
            </Info>
          }
        />
    </Layout>
  );
}
