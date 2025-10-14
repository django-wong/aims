import Layout from '@/layouts/app-layout'
import { Head } from '@inertiajs/react'
import { BreadcrumbItem } from '@/types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQueryParam } from '@/hooks/use-query-param';
import { useMemo } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: "Home",
    href: "/"
  },
  {
    title: 'Skill Matrix',
    href: '.'
  }
]
export default function SkillMatrixPage() {
  const [type, setType] = useQueryParam('type', 'I');

  const preview_url = useMemo(() => {
    const searches = new URLSearchParams({'filter[i_e_a]': type, preview: '1'});
    return `/api/v1/reports/skill-matrix?${searches.toString()}`
  }, [type]);

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Head title="skill-matrix" />
      <div className={'px-6 gap-6 flex-1 flex flex-col'}>
        <Tabs value={type} onValueChange={setType}>
          <TabsList>
            <TabsTrigger value={'I'}>Inspection</TabsTrigger>
            <TabsTrigger value={'E'}>Expedition</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className={'w-full flex-1'}>
          <iframe src={preview_url} className={'w-full h-full min-h-[500px]'} title={preview_url}/>
        </div>
      </div>
    </Layout>
  );
}
