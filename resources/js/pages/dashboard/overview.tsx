import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { IconTrendingUp } from '@tabler/icons-react';
import { Link2Icon, SendIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Link } from '@inertiajs/react';
import { formatCurrency } from '@/lib/helpers';
import { cn } from '@/utils/cn';
import { NumberTicker } from '@/components/ui/number-ticker';

export interface DashboardOverviewProps {
  open_assignment: number;
  pending_approval: number;
  invoice: {
    outbound: number;
    inbound: number;
    rejected: number;
  };
  hours: {
    claimed: number;
    growing: number;
  }
  revenue: {
    this_year: number;
  }
}

export function DashboardOverview(props: DashboardOverviewProps) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs 2xl:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Open Assignment</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl"><NumberTicker value={props.open_assignment}/></CardTitle>
          <CardAction className={'self-end'}>
            <div className={'bg-primary/5 aspect-square rounded-full border p-2'}>
              <Link href={route('assignments')}>
                <Link2Icon size={16} />
              </Link>
            </div>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <Badge variant={'outline'}>{props.pending_approval}</Badge> timesheets pending approval
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Invoices</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <NumberTicker value={props.invoice.inbound}/> <small>received</small>, <NumberTicker value={props.invoice.outbound}/> <small>sent</small>
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            <Badge variant={'outline'}><NumberTicker value={props.invoice.rejected}/></Badge> declined invoices
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Claimed Hours</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            <NumberTicker value={props.hours.claimed} startValue={Math.max(props.hours.claimed - 14, 0)}/> hrs
            <div className={cn('pt-2 text-xs font-bold', props.hours.growing > 0 ? 'text-green-500' : 'text-red-500')}>
              <strong>{props.hours.growing}</strong> since last week
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Revenue This Year</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            $<NumberTicker value={props.revenue.this_year} startValue={Math.max(props.revenue.this_year - 50, 0)}/>
            <div className={'text-muted-foreground pt-2 text-xs'}>Exclude expenses and commission</div>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
