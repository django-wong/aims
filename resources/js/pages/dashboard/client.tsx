import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { IconTrendingUp } from '@tabler/icons-react';

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
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <div className="flex flex-col gap-6 px-6">
        <div>
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs 2xl:grid-cols-4">
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Total Projects</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">3</CardTitle>
                <CardFooter className="flex-col items-start gap-1.5 text-sm">
                  <div className="line-clamp-1 flex gap-2 font-medium">
                    Trending up this month <IconTrendingUp className="size-4" />
                  </div>
                  <div className="text-muted-foreground">Visitors for the last 6 months</div>
                </CardFooter>
              </CardHeader>
            </Card>
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Pending Timesheets</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">6</CardTitle>
                <CardAction className={'self-end'}></CardAction>
              </CardHeader>
            </Card>
            <Card className="@container/card">
              <CardHeader>
                <CardDescription>Invoices</CardDescription>
                <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">4/3/4</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
