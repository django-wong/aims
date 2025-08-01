import { Comments } from '@/components/comments';
import { Divider } from '@/components/divider';
import { Info, InfoHead, InfoLine, InfoLineLabel, InfoLineValue } from '@/components/info';
import { MainContent, MainContentBlock } from '@/components/main-content';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useLocationHash } from '@/hooks/use-location-hash';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Project } from '@/types';
import { PropsWithChildren } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';

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
      <MainContent>
        <MainContentBlock className={'flex-1'}>
          <Tabs value={hash} onValueChange={setHash}>
            <TabsList>
              <TabsTrigger value={'details'}>Details</TabsTrigger>
              <TabsTrigger value={'comments'}>Comments & Attachments</TabsTrigger>
            </TabsList>
            <TabsContent value={'details'}>
              <Content project={props.project}>TODO: Show project details</Content>
            </TabsContent>
            <TabsContent value={'comments'}>
              <Comments commentableType={'Project'} commentableId={props.project.id} />
            </TabsContent>
          </Tabs>
        </MainContentBlock>
        <Divider orientation={'vertical'} className={'h-full'} />
        <MainContentBlock className={'w-lg'}>
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
        </MainContentBlock>
      </MainContent>
    </AppLayout>
  );
}

function Content(props: PropsWithChildren<{ project: Project }>) {
  return (
    <div className={'mt-6'}>
      <div className={'grid grid-cols-2 gap-4 lg:grid-cols-4'}>
        <div className={'bg-muted/50 min-h-[100px] rounded-lg border'}></div>
        <div className={'bg-muted/50 min-h-[100px] rounded-lg border'}></div>
        <div className={'bg-muted/50 min-h-[100px] rounded-lg border'}></div>
        <div className={'bg-muted/50 min-h-[100px] rounded-lg border'}></div>
      </div>
      <div className={'bg-muted/10 mt-6 flex min-h-[200px] items-center justify-center rounded-lg border border-2 border-dashed'}>
        {props.children}
      </div>
    </div>
  );
}
