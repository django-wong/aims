import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebar } from '@/components/app-sidebar';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

export function LargeTitle(props: { title?: string; pageAction?: React.ReactNode }) {
  if (props.title) {
    return (
      <>
        <Head title={props.title} />
        <div className={'flex items-end justify-between gap-6 px-6'}>
          <h1 className={'text-4xl'}>{props.title}</h1>
          <div className={'flex items-center gap-2'}>{props.pageAction}</div>
        </div>
      </>
    );
  } else {
    return null;
  }
}

export interface AppSidebarLayoutProps {
  children: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  pageAction?: React.ReactNode;
  largeTitle?: string;
}

export default function AppSidebarLayout({
  children,
  breadcrumbs = [],
  pageAction,
  ...props
}: AppSidebarLayoutProps) {
  return (
    <AppShell variant={'sidebar'}>
      <AppSidebar variant={'sidebar'} />
      <AppContent>
        <AppSidebarHeader breadcrumbs={breadcrumbs} />
        <LargeTitle title={props.largeTitle || (breadcrumbs.length > 0 ? breadcrumbs[breadcrumbs.length - 1].title : undefined)} pageAction={pageAction} />
        {children}
      </AppContent>
    </AppShell>
  );
}
