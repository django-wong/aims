import { Comments } from '@/components/comments';
import { Divider } from '@/components/divider';
import { Info, InfoHead, InfoLine, InfoLineLabel, InfoLineValue } from '@/components/info';
import { MainContent, MainContentBlock, TwoColumnLayout73 } from '@/components/main-content';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocationHash } from '@/hooks/use-location-hash';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Project } from '@/types';
import { PropsWithChildren } from 'react';

export default function ProjectEdit(props: { project: Project }) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Home',
      href: '/',
    },
    {
      title: 'Projects',
      href: '/projects',
    },
    {
      title: props.project.title,
      href: '.',
    },
  ];

  const [hash, setHash] = useLocationHash('details');

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <TwoColumnLayout73
        left={
          <Tabs value={hash} onValueChange={setHash}>
            <TabsList className={'mb-4'}>
              <TabsTrigger value={'details'}>Details</TabsTrigger>
              <TabsTrigger value={'assignments'}>Assignments</TabsTrigger>
              <TabsTrigger value={'comments'}>Comments & Attachments</TabsTrigger>
            </TabsList>
            <TabsContent value={'details'}>
              <Content project={props.project}>TODO: Show project details</Content>
            </TabsContent>
            <TabsContent value={'assignments'}>

            </TabsContent>
            <TabsContent value={'comments'}>
              <Comments commentableType={'Project'} commentableId={props.project.id} />
            </TabsContent>
          </Tabs>
        }
        right={
          <Info>
            <InfoHead>
              Information
            </InfoHead>
            <InfoLine icon={'text'} label={'Title'}>
              {props.project.title}
            </InfoLine>
            <InfoLine icon={'info'} label={'Project Type'}>
              {props.project.project_type?.name || 'N/A'}
            </InfoLine>
            <InfoLine icon={'shopping-cart'} label={'PO Number'}>
              <Badge>{props.project.po_number || 'N/A'}</Badge>
            </InfoLine>
            <InfoLine icon={'dollar-sign'} label={'Budget'}>
              {props.project.budget ? `$${props.project.budget}` : 'N/A'}
            </InfoLine>
            <Divider className={'my-2'}/>
            <InfoHead>
              Client
            </InfoHead>
            <InfoLine icon={'user-2'} label={'Client'}>{props.project.client?.business_name || 'N/A'}</InfoLine>
            <InfoLine label={'Coordinator'} icon={'user-check'}>
              {props.project.client?.coordinator?.name || 'N/A'}
            </InfoLine>
            <div className={'flex flex-col gap-2'}>
              <InfoLineLabel icon={'notebook'}>Notes</InfoLineLabel>
              <InfoLineValue>
                <p className={'break-all text-sm text-muted-foreground'}>
                  {props.project.client?.notes || 'N/A'}
                </p>
              </InfoLineValue>
            </div>
          </Info>
        }
      />
    </AppLayout>
  );
}

function Content(props: PropsWithChildren<{ project: Project }>) {
  return (
    <div>
      <div className={'grid grid-cols-2 gap-4 lg:grid-cols-4'}>
        <Skeleton className={'min-h-[100px] rounded-lg border bg-muted-foreground/10'}></Skeleton>
        <Skeleton className={'min-h-[100px] rounded-lg border bg-muted-foreground/10'}></Skeleton>
        <Skeleton className={'min-h-[100px] rounded-lg border bg-muted-foreground/10'}></Skeleton>
        <Skeleton className={'min-h-[100px] rounded-lg border bg-muted-foreground/10'}></Skeleton>
      </div>
      <Skeleton className={'bg-muted-foreground/10 mt-6 flex min-h-[200px] items-center justify-center rounded-lg border border-dashed'}>
        {props.children}
      </Skeleton>
    </div>
  );
}
