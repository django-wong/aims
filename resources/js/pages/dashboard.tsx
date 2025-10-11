import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClockFadingIcon, FileCheckIcon } from 'lucide-react';
import { Timesheets } from '@/pages/assignments/timesheets';
import { useLocationHash } from '@/hooks/use-location-hash';
import { HideFromClient, VisibleToClient, VisibleToOperator, VisibleToStaffAndAbove } from '@/components/hide-from-client';
import { useAssignmentsTable } from '@/pages/assignments';
import { MonthlyRevenue } from '@/pages/dashboard/monthly-revenue';
import { DashboardOverview } from '@/pages/dashboard/overview';

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
      <VisibleToOperator>
        <InspectorDashboard/>
      </VisibleToOperator>
    </AppLayout>
  );
}

function GeneralDashboard() {
  return (
    <div className="flex flex-col px-6 gap-6">
      <DashboardOverview />
      <MonthlyRevenue />
      <div className={'flex gap-4'}>
        <Skeleton className="h-8 w-[200px] rounded-full" />
        <Skeleton className="h-8 w-[160px] rounded-full" />
        <div className={'flex-grow'}></div>
        <Skeleton className="h-8 w-[120px] rounded-full" />
      </div>
      <Skeleton className={'rounded-xl min-h-[30vh]'}/>
    </div>
  );
}

function InspectorDashboard() {
  const {
    content
  } = useAssignmentsTable();
  return <div className={'px-6'}>{content}</div>;
}
