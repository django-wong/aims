import Layout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQueryParam } from '@/hooks/use-query-param';
import { Disciplines } from '@/pages/system-configurations/disciplines';
import { Skills } from '@/pages/system-configurations/skills';
import { CertificateLevels } from '@/pages/system-configurations/certificate/levels';
import { CertificateTypes } from '@/pages/system-configurations/certificate/types';

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

export default function SystemConfigurationPage() {
  const [tab, setTab] = useQueryParam('tab', 'skills');

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Head title="system-configuration" />
      <div className={'px-6'}>
        <Tabs value={tab} onValueChange={setTab} className={'w-full '}>
          <TabsList className={'mb-4'}>
            <TabsTrigger value={'skills'}>
              Skills
            </TabsTrigger>
            <TabsTrigger value={'certification-types'}>
              Certification Types
            </TabsTrigger>
            <TabsTrigger value={'levels'}>
              Levels
            </TabsTrigger>
            <TabsTrigger value={'discipline'}>
              Disciplines
            </TabsTrigger>
          </TabsList>
          <TabsContent value={'skills'}>
            <Skills/>
          </TabsContent>
          <TabsContent value={'certification-types'}>
            <CertificateTypes/>
          </TabsContent>
          <TabsContent value={'levels'}>
            <CertificateLevels/>
          </TabsContent>
          <TabsContent value={'discipline'}>
            <Disciplines/>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
