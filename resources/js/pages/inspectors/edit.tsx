import { PopoverConfirm } from '@/components/popover-confirm';
import { Button } from '@/components/ui/button';
import Layout from '@/layouts/app-layout';
import { BreadcrumbItem, User } from '@/types';
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
          <Impersonate userId={props.inspector.id}/>
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
              router.reload();
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
      <Head title={props.inspector.name} />
      <TwoColumnLayout73
        left={
          <Tabs value={hash} onValueChange={setHash}>
            <TabsList className={'mb-4'}>
              <TabsTrigger value={'skills'}>Skills</TabsTrigger>
              <TabsTrigger value={'certificates'}>Certificates</TabsTrigger>
            </TabsList>
            <TabsContent value={'skills'}>
              <UserSkills inspector={props.inspector} />
            </TabsContent>
            <TabsContent value={'certificates'}>
              <UserCertificates inspector={props.inspector} />
            </TabsContent>
          </Tabs>
        }
        right={
          <Info>
            <InfoHead>Inspector Profile</InfoHead>
            <div>
              <InfoLine label={'Name'} icon={'user'}>
                {props.inspector.name}
              </InfoLine>
              <InfoLine label={'Email'} icon={'mail'}>
                {props.inspector.email}
              </InfoLine>
              <InfoLine label={'Initials'} icon={'type'}>
                {props.inspector.inspector_profile?.initials ?? 'N/A'}
              </InfoLine>
              <InfoLine label={'Assigned ID'} icon={'id-card'}>
                {props.inspector.inspector_profile?.assigned_identifier ?? 'N/A'}
              </InfoLine>
              <InfoLine label={'Address'} icon={'map-pin'}>
                {props.inspector.address?.full_address ?? 'N/A'}
              </InfoLine>
              <InfoLine label={'Hourly Rate'} icon={'dollar-sign'}>
                {props.inspector.inspector_profile?.hourly_rate != null ? `$${props.inspector.inspector_profile.hourly_rate}` : 'N/A'}
              </InfoLine>
              <InfoLine label={'Travel Rate'} icon={'car'}>
                {props.inspector.inspector_profile?.travel_rate != null ? `$${props.inspector.inspector_profile.travel_rate}` : 'N/A'}
              </InfoLine>
              {(props.inspector.inspector_profile?.new_hourly_rate != null ||
                props.inspector.inspector_profile?.new_travel_rate != null ||
                props.inspector.inspector_profile?.new_rate_effective_date != null) && (
                <>
                  <InfoLine label={'New Hourly Rate'} icon={'trending-up'}>
                    {props.inspector.inspector_profile?.new_hourly_rate != null ? `$${props.inspector.inspector_profile.new_hourly_rate}` : 'N/A'}
                  </InfoLine>
                  <InfoLine label={'New Travel Rate'} icon={'trending-up'}>
                    {props.inspector.inspector_profile?.new_travel_rate != null ? `$${props.inspector.inspector_profile.new_travel_rate}` : 'N/A'}
                  </InfoLine>
                  <InfoLine label={'Effective Date'} icon={'calendar'}>
                    {props.inspector.inspector_profile?.new_rate_effective_date ?? 'N/A'}
                  </InfoLine>
                </>
              )}
              <InfoLine label={'On Skills Matrix'} icon={'check-circle'}>
                {props.inspector.inspector_profile?.include_on_skills_matrix ? 'Yes' : 'No'}
              </InfoLine>
            </div>
            <InfoHead>Notes</InfoHead>
            <InfoLineValue>{props.inspector.inspector_profile?.notes}</InfoLineValue>
          </Info>
        }
      />
    </Layout>
  );
}




