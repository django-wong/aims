import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';

export function LargeTitle(props: { title?: string; pageAction?: React.ReactNode }) {
  if (props.title) {
    return (
      <div className={'flex items-end justify-between gap-6 px-6'}>
        <h1 className={'text-4xl'}>{props.title}</h1>
        <div className={'flex items-center gap-2'}>{props.pageAction}</div>
      </div>
    );
  } else {
    return null;
  }
}

export default function AppSidebarLayout({
  children,
  breadcrumbs = [],
  pageAction,
}: {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  pageAction?: React.ReactNode;
}) {
  return (
    <AppShell variant={'sidebar'}>
      <AppSidebar variant={'sidebar'} />
      <AppContent>
        <AppSidebarHeader breadcrumbs={breadcrumbs} />
        <LargeTitle title={breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].title : undefined} pageAction={pageAction} />
        {children}
      </AppContent>
    </AppShell>
  );
}
