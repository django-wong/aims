import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AppLayout from '@/layouts/app-layout';
import { Timesheets } from '@/pages/assignments/timesheets';
import { BreadcrumbItem } from '@/types';
import { ClockFadingIcon, FileCheckIcon } from 'lucide-react';
import { useLocationHash } from '@/hooks/use-location-hash';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

export default function ClientDashboard() {
  const [hash, setHash] = useLocationHash('timesheets');

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-col gap-6 px-6">
        <Tabs value={hash} onValueChange={setHash}>
          <TabsList className={'mb-4'}>
            <TabsTrigger value={'timesheets'}>
              <ClockFadingIcon />
              <span className={'hidden sm:inline'}>Pending Timesheet</span>
            </TabsTrigger>
            <TabsTrigger value={'invoices'}>
              <FileCheckIcon />
              <span className={'hidden sm:inline'}>Invoices</span>
            </TabsTrigger>
          </TabsList>
          <TabsContent value={'timesheets'}>
            <div className={'grid gap-4'}>
              <Timesheets
                filters={{
                  'filter[status]': '= 3',
                }}
              />
            </div>
          </TabsContent>
          <TabsContent value={'invoices'}>TODO: Invoices</TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
