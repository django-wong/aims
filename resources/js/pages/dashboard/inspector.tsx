import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { HideFromClient } from '@/components/hide-from-client';
import { useAssignmentsTable } from '@/pages/assignments';

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

export default function InspectorDashboard() {
  const {
    content
  } = useAssignmentsTable();

  return (
    <AppLayout
      breadcrumbs={breadcrumbs}
      pageAction={
        <HideFromClient>
          <Skeleton className="h-8 w-[60px] rounded-full" />
        </HideFromClient>
      }>
      <div className={'px-6'}>{content}</div>
    </AppLayout>
  );
}
