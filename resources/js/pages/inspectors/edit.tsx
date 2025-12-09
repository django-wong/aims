import { PopoverConfirm } from '@/components/popover-confirm';
import { Button } from '@/components/ui/button';
import Layout from '@/layouts/app-layout';
import { BreadcrumbItem, InspectorProfile } from '@/types';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { Trash, UserRoundPen } from 'lucide-react';
import { InspectorForm } from '@/pages/inspectors';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Info, InfoHead, InfoLine, InfoLineValue } from '@/components/info';
import { TwoColumnLayout73 } from '@/components/main-content';
import * as React from 'react';
import { useLocationHash } from '@/hooks/use-location-hash';
import { UserSkills } from '@/pages/inspectors/skills';
import { UserCertificates } from '@/pages/inspectors/certificates';
import { Impersonate } from '@/pages/clients/impersonate';

interface InspectorEditProps {
  inspector: InspectorProfile;
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
          <Impersonate userId={props.inspector.user_id}/>
          <PopoverConfirm
            asChild
            message={'Are you sure to delete this inspector? THis action cannot be undone.'}
            onConfirm={() => {
              // TODO: Delete inspector profile first if needed
              axios.delete(route('users.destroy', { id: props.inspector.user_id })).then(() => {
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
              router.reload();
            }}
          >
            <Button size={'sm'} variant={'secondary'}>
              <UserRoundPen /> Edit
            </Button>
          </InspectorForm>
        </>
      }
      breadcrumbs={[...breadcrumbs, { title: props.inspector.user?.name ?? '', href: '.' }]}
    >
      <Head title={props.inspector.user?.name ?? ''} />
      <TwoColumnLayout73
        left={
          <Tabs value={hash} onValueChange={setHash}>
            <TabsList className={'mb-4'}>
              <TabsTrigger value={'skills'}>Skills</TabsTrigger>
              <TabsTrigger value={'certificates'}>Certificates</TabsTrigger>
            </TabsList>
            <TabsContent value={'skills'}>
              {
                props.inspector.user ? (
                  <UserSkills user_id={props.inspector.user_id} />
                ) : null
              }
            </TabsContent>
            <TabsContent value={'certificates'}>
              {
                props.inspector.user ? (
                  <UserCertificates user_id={props.inspector.user_id} />
                ) : null
              }
            </TabsContent>
          </Tabs>
        }
        right={
          <Info>
            <InfoHead>Inspector Profile</InfoHead>
            <div>
              <InfoLine label={'Name'} icon={'user'}>
                {props.inspector.user?.name}
              </InfoLine>
              <InfoLine label={'Email'} icon={'mail'}>
                {props.inspector.user?.email}
              </InfoLine>
              <InfoLine label={'Initials'} icon={'type'}>
                {props.inspector?.initials ?? 'N/A'}
              </InfoLine>
              <InfoLine label={'Assigned ID'} icon={'id-card'}>
                {props.inspector.assigned_identifier ?? 'N/A'}
              </InfoLine>
              <InfoLine label={'Address'} icon={'map-pin'}>
                {props.inspector.address?.full_address ?? 'N/A'}
              </InfoLine>
              <InfoLine label={'Hourly Rate'} icon={'dollar-sign'}>
                {props.inspector.hourly_rate != null ? `$${props.inspector.hourly_rate}` : 'N/A'}
              </InfoLine>
              <InfoLine label={'Travel Rate'} icon={'car'}>
                {props.inspector?.travel_rate != null ? `$${props.inspector.travel_rate}` : 'N/A'}
              </InfoLine>
              {(props.inspector?.new_hourly_rate != null ||
                props.inspector?.new_travel_rate != null ||
                props.inspector?.new_rate_effective_date != null) && (
                <>
                  <InfoLine label={'New Hourly Rate'} icon={'trending-up'}>
                    {props.inspector?.new_hourly_rate != null ? `$${props.inspector.new_hourly_rate}` : 'N/A'}
                  </InfoLine>
                  <InfoLine label={'New Travel Rate'} icon={'trending-up'}>
                    {props.inspector?.new_travel_rate != null ? `$${props.inspector.new_travel_rate}` : 'N/A'}
                  </InfoLine>
                  <InfoLine label={'Effective Date'} icon={'calendar'}>
                    {props.inspector?.new_rate_effective_date ?? 'N/A'}
                  </InfoLine>
                </>
              )}
              <InfoLine label={'On Skills Matrix'} icon={'check-circle'}>
                {props.inspector?.include_on_skills_matrix ? 'Yes' : 'No'}
              </InfoLine>
            </div>
            <InfoHead>Notes</InfoHead>
            <InfoLineValue>{props.inspector?.notes}</InfoLineValue>
          </Info>
        }
      />
    </Layout>
  );
}




