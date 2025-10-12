import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { IconTrendingUp } from '@tabler/icons-react';
import { Link2Icon, SendIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function DashboardOverview() {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs 2xl:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Open Assignment (DEMO)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            23
          </CardTitle>
          <CardAction className={'self-end'}>
            <div className={'aspect-square bg-primary/5 p-2 rounded-full border'}>
              <Link2Icon size={16}/>
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <Badge variant={'outline'}>12</Badge> timesheets pending approval
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Invoices</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            5 <small>received</small>, 2 <small>sent</small>
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <Badge variant={'outline'}>2</Badge> declined invoices
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Approve Hours</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            3434 hrs
            <div className={'font-bold text-xs pt-2 text-green-500'}>
              +40 hrs yesterday
            </div>
          </CardTitle>
        </CardHeader>
        {/*<CardFooter className="flex-col items-start gap-1.5 text-sm">*/}
        {/*  <div className="line-clamp-1 flex gap-2 font-medium">*/}
        {/*    Strong user retention <IconTrendingUp className="size-4" />*/}
        {/*  </div>*/}
        {/*</CardFooter>*/}
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Revenue</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $123,123.44
            <div className={'text-xs text-muted-foreground pt-2'}>
              $12,123.30 last year
            </div>
          </CardTitle>
        </CardHeader>
        {/*<CardFooter className="flex-col items-start gap-1.5 text-sm">*/}
        {/*  <div className="line-clamp-1 flex gap-2 font-medium">*/}
        {/*    <IconTrendingUp className="size-4" /> Compared to last year*/}
        {/*  </div>*/}
        {/*</CardFooter>*/}
      </Card>
    </div>
  );
}
