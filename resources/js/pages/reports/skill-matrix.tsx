import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useSearchParams } from '@/hooks/use-search-params';
import Layout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useMemo } from 'react';

interface SkillMatrixPageProps {
  locations: string[];
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Skill Matrix',
    href: '.',
  },
];

export default function SkillMatrixPage(props: SkillMatrixPageProps) {
  const [params, setParams] = useSearchParams({
    'filter[type]': 'inspection',
    preview: '1',
  });

  const preview_url = useMemo(() => {
    return `/api/v1/reports/skill-matrix?${params.toString()}`;
  }, [params]);

  return (
    <Layout breadcrumbs={breadcrumbs}>
      <Head title="skill-matrix" />
      <div className={'flex flex-1 flex-col gap-6 px-6'}>
        <div className={'flex items-center gap-4'}>
          <Tabs
            value={params.get('filter[type]') ?? 'inspection'}
            onValueChange={(type) => {
              setParams((params) => {
                params.set('filter[type]', type);
                return params;
              });
            }}
          >
            <TabsList>
              <TabsTrigger value={'inspection'}>Inspection</TabsTrigger>
              <TabsTrigger value={'expedition'}>Expedition</TabsTrigger>
              <TabsTrigger value={'specialist'}>Specialist</TabsTrigger>
            </TabsList>
          </Tabs>
          {props.locations.length > 0 ? (
            <Select
              onValueChange={(value) => {
                setParams((params) => {
                  params.set('filter[location]', value);
                  return params;
                });
              }}
              value={params.get('filter[location]') ?? ''}
            >
              <SelectTrigger clearable={true} className={'bg-background max-w-[200px]'}>
                <SelectValue placeholder={'Filter location'} />
              </SelectTrigger>
              <SelectContent>
                {props.locations.map((location, index) => (
                  <SelectItem key={index} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : null}
        </div>
        <div className={'w-full flex-1'}>
          <iframe src={preview_url} className={'h-full min-h-[500px] w-full'} title={preview_url} />
        </div>
      </div>
    </Layout>
  );
}
