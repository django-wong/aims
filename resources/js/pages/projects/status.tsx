import { PropsWithChildren } from 'react';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Home',
    href: '/',
  },
  {
    title: 'Jobs',
    href: '/jobs',
  },
  {
    title: 'Status',
    href: '/jobs/status',
  },
];

export default (props: PropsWithChildren) => {
  return <AppLayout breadcrumbs={breadcrumbs}>
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-2xl font-bold mb-4">Job Status</h1>
      <p className="text-lg">This page will display the status of your jobs.</p>
      {props.children}
    </div>
  </AppLayout>
}
