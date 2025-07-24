import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Project } from '@/types';
import { useLocationHash } from '@/hooks/use-location-hash';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/data-table';
import { Comments } from '@/components/comments';
import { PropsWithChildren } from 'react';

import data from '../../components/data.json';

export default function ProjectEdit(props: {project: Project}) {
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
    }
  ];

  const [hash, setHash] = useLocationHash('details');

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="px-6">
        <Tabs value={hash} onValueChange={setHash}>
          <TabsList>
            <TabsTrigger value={'details'}>Details</TabsTrigger>
            <TabsTrigger value={'comments'}>Comments & Attachments</TabsTrigger>
          </TabsList>
          <TabsContent value={'details'}>
            <Content project={props.project}>TODO: Show project details</Content>
          </TabsContent>
          <TabsContent value={'comments'}>
            <Comments commentableType={'Project'} commentableId={props.project.id}/>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

function Content(props: PropsWithChildren<{project: Project}>) {
  return (
    <div className={'mt-6'}>
      <div className={'grid grid-cols-2 lg:grid-cols-4 gap-4'}>
        <div className={'border rounded-lg min-h-[100px] bg-muted/50'}></div>
        <div className={'border rounded-lg min-h-[100px] bg-muted/50'}></div>
        <div className={'border rounded-lg min-h-[100px] bg-muted/50'}></div>
        <div className={'border rounded-lg min-h-[100px] bg-muted/50'}></div>
      </div>
      <div className={'min-h-[200px] flex items-center justify-center bg-muted/10 border rounded-lg mt-6 border-dashed border-2'}>
        {props.children}
      </div>
    </div>
  );
}
