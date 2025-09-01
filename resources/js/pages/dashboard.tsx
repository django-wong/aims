import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, SharedData } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { usePage } from '@inertiajs/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClockFadingIcon, FileCheckIcon } from 'lucide-react';
import { Timesheets } from '@/pages/assignments/timesheets';
import { useLocationHash } from '@/hooks/use-location-hash';
import { HideFromClient, VisibleToClient, VisibleToOperator, VisibleToStaffAndAbove } from '@/components/hide-from-client';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Dashboard',
    href: '/dashboard',
  }
]

export default function Page() {
  return (
    <AppLayout
      breadcrumbs={breadcrumbs}
      pageAction={
        <HideFromClient>
          <Skeleton className="h-8 w-[60px] rounded-full" />
        </HideFromClient>
      }>
      <VisibleToStaffAndAbove><GeneralDashboard /></VisibleToStaffAndAbove>
      <VisibleToClient><ClientDasboard /></VisibleToClient>
      <VisibleToOperator>
        <div className="m-6 p-4 border rounded-lg bg-yellow-50 text-yellow-800">
          <p>You are logged in as an Operator. Please use the admin panel to manage the system.</p>
          <p>TODO: Show inspector's assignments</p>
        </div>
      </VisibleToOperator>
    </AppLayout>
  );
}

function GeneralDashboard() {
  return (
    <div className="flex flex-col px-6 gap-6">
      <div className={'flex gap-4'}>
        <Skeleton className="h-8 w-[200px] rounded-full" />
        <Skeleton className="h-8 w-[160px] rounded-full" />
        <div className={'flex-grow'}></div>
        <Skeleton className="h-8 w-[120px] rounded-full" />
      </div>
      <Skeleton className={'rounded-xl min-h-[30vh]'}>

      </Skeleton>
    </div>
  );
}


function ClientDasboard() {
  const [hash, setHash] = useLocationHash('timesheets');

  return (
    <div className={'px-6'}>
      <Tabs value={hash} onValueChange={setHash}>
        <TabsList className={'mb-4'}>
          <TabsTrigger value={'timesheets'}>
            <ClockFadingIcon/>
            <span className={'hidden sm:inline'}>Pending Timesheet</span>
          </TabsTrigger>
          <TabsTrigger value={'invoices'}>
            <FileCheckIcon/>
            <span className={'hidden sm:inline'}>Invoices</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value={'timesheets'}>
          <div className={'grid gap-4'}>
            <div className={'overflow-hidden'}>
              <Timesheets
                filters={{
                  'filter[status]': '= 3'
                }}
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value={'invoices'}>TODO: Invoices</TabsContent>
      </Tabs>
    </div>
  );
}
