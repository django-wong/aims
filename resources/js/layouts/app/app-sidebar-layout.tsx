import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';

export function LargeTitle(props: {
  title?: string
}) {
  if (props.title) {
    return (
      <h1 className={'text-xl font-bold px-7'}>{props.title}</h1>
    );
  } else {
    return null;
  }
}

export default function AppSidebarLayout({ children, breadcrumbs = [] }: { children: React.ReactNode; breadcrumbs?: BreadcrumbItem[] }) {
    return (
        <AppShell variant={'sidebar'}>
            <AppSidebar variant={'sidebar'} />
            <AppContent>
              <AppSidebarHeader breadcrumbs={breadcrumbs} />
              <LargeTitle title={breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].title : undefined} />
              {children}
            </AppContent>
        </AppShell>
    );
}
