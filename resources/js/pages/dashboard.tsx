// import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
// import { SectionCards } from "@/components/section-cards"

import data from "./data.json"
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

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
        <Skeleton className="h-8 w-[60px] rounded-full" />
      }>
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
    </AppLayout>
  )
}
