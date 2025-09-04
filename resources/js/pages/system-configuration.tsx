import Layout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQueryParam } from '@/hooks/use-query-param';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'System Configuration',
    href: '.',
  },
];

export default function SystemConfigurationPage(props: any) {
  const [tab, setTab] = useQueryParam('tab', 'skills');

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Head title="system-configuration" />
      <div className={'px-6'}>
        <Tabs value={tab} onValueChange={setTab} className={'w-full'}>
          <TabsList>
            <TabsTrigger value={'skills'}>Skills</TabsTrigger>
            <TabsTrigger value={'certification-types'}>Certification Types</TabsTrigger>
            <TabsTrigger value={'levels'}>Levels</TabsTrigger>
            <TabsTrigger value={'discipline'}>Disciplines</TabsTrigger>
          </TabsList>
          <TabsContent value={'skills'}>
            TODO: This the page where you can manage skills, certification types, levels, and disciplines.
          </TabsContent>
          <TabsContent value={'certification-types'}></TabsContent>
          <TabsContent value={'levels'}></TabsContent>
          <TabsContent value={'discipline'}></TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
