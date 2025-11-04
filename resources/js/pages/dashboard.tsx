import { Skeleton } from '@/components/ui/skeleton';
import AppLayout from '@/layouts/app-layout';
import { MonthlyRevenue } from '@/pages/dashboard/monthly-revenue';
import { DashboardOverview, DashboardOverviewProps } from '@/pages/dashboard/overview';
import { BreadcrumbItem } from '@/types';

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

type DashboardProps = DashboardOverviewProps & {};

export default function DashboardPage(props: DashboardProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs} pageAction={<Skeleton className="h-8 w-[60px] rounded-full" />}>
      <div className="flex flex-col gap-6 px-6">
        <DashboardOverview {...props} />
        <MonthlyRevenue />
        <div className={'flex gap-4'}>
          <Skeleton className="h-8 w-[200px] rounded-full" />
          <Skeleton className="h-8 w-[160px] rounded-full" />
          <div className={'flex-grow'}></div>
          <Skeleton className="h-8 w-[120px] rounded-full" />
        </div>
        <Skeleton className={'min-h-[30vh] rounded-xl'} />
      </div>
    </AppLayout>
  );
}
