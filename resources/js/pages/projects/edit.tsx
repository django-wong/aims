import { Comments } from '@/components/comments';
import { Divider } from '@/components/divider';
import { Info, InfoHead, InfoLine, InfoLineValue } from '@/components/info';
import { TwoColumnLayout73 } from '@/components/main-content';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Project } from '@/types';
import { PropsWithChildren } from 'react';
import { useAssignmentsTable } from '@/pages/assignments';
import { ContactIcon, InfoIcon, MessagesSquareIcon, PencilIcon, TargetIcon } from 'lucide-react';
import { useQueryParam } from '@/hooks/use-query-param';
import { HideFromClient } from '@/components/hide-from-client';
import { ProjectForm } from '@/pages/projects/form';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

export default function ProjectEdit(props: { project: Project }) {

  const { content } = useAssignmentsTable({project: props.project});

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

  const [tab, setTab] = useQueryParam('tab', 'assignments');

  return (
    <AppLayout
      breadcrumbs={breadcrumbs}
      pageAction={
        <HideFromClient>
          <ProjectForm value={props.project} onSubmit={() => {router.reload()}}>
            <Button variant={'secondary'}>
              <PencilIcon/>
              Edit
            </Button>
          </ProjectForm>
        </HideFromClient>
      }>
      <TwoColumnLayout73
        left={
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className={'mb-4'}>
              <TabsTrigger value={'assignments'}>
                <ContactIcon/>
                <span className={'hidden lg:inline'}>Assignments</span>
              </TabsTrigger>
              <TabsTrigger value={'nois'}>
                <TargetIcon/>
                <span className={'hidden lg:inline'}>NOIs</span>
              </TabsTrigger>
              <HideFromClient>
                <TabsTrigger value={'comments'}>
                  <MessagesSquareIcon/>
                  <span className={'hidden lg:inline'}>Comments & Attachments</span>
                </TabsTrigger>
              </HideFromClient>
            </TabsList>
            <TabsContent value={'assignments'}>{content}</TabsContent>
            <HideFromClient>
              <TabsContent value={'comments'}>
                <Comments commentableType={'Project'} commentableId={props.project.id} />
              </TabsContent>
            </HideFromClient>
            <TabsContent value={'nois'}>
              TODO: Notification of inspections
            </TabsContent>
          </Tabs>
        }
        right={
          <Info>
            <InfoHead>Information</InfoHead>
            <div>
              <InfoLine icon={'text'} label={'Title'}>{props.project.title}</InfoLine>
              <InfoLine icon={'info'} label={'Project Type'}>{props.project.project_type?.name || 'N/A'}</InfoLine>
              <HideFromClient>
                <InfoLine icon={'info'} label={'Commission Rate'}>{props.project.commission_rate}%</InfoLine>
                <InfoLine icon={'info'} label={'Process fee'}>{props.project.process_fee_rate}%</InfoLine>
              </HideFromClient>
            </div>

            <Divider/>

            <InfoHead>Client</InfoHead>
            <div>
              <InfoLine icon={'user-2'} label={'Client'}>
                {props.project.client?.business_name || 'N/A'}
              </InfoLine>
              <InfoLine label={'Coordinator'} icon={'user-2'}>
                {props.project.client?.coordinator?.name || 'N/A'}
              </InfoLine>
            </div>

            <HideFromClient>
              <InfoHead>Client Notes</InfoHead>
              <InfoLineValue>{props.project.client?.notes || 'N/A'}</InfoLineValue>
            </HideFromClient>
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
