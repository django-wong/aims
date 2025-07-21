import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Project } from '@/types';
import { useLocationHash } from '@/hooks/use-location-hash';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DataTable } from '@/components/data-table';


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

  const [hash, setHash] = useLocationHash('assignments');

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="px-6">
        <Tabs value={hash} onValueChange={setHash}>
          <TabsList>
            <TabsTrigger value={'assignments'}>Assignments</TabsTrigger>
            <TabsTrigger value={'timesheets'}>Timesheets</TabsTrigger>
            <TabsTrigger value={'expenses'}>Expenses</TabsTrigger>
            <TabsTrigger value={'comments'}>Comment & Attachments</TabsTrigger>
          </TabsList>
          <TabsContent value={'assignments'}>
            <Content>assignments</Content>
          </TabsContent>
          <TabsContent value={'timesheets'}>
            <Content>timesheets</Content>
          </TabsContent>
          <TabsContent value={'expenses'}>
            <Content>expenses</Content>
          </TabsContent>
          <TabsContent value={'comments'}>
            <Content>comments</Content>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}

function Content({children}: {children: React.ReactNode}) {
  return (
    <div className="-mx-4 lg:-mx-6 py-6">
      <DataTable data={[]}/>
    </div>
  );
}
