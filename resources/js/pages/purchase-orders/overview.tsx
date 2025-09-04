import { IconTrendingDown, IconTrendingUp } from '@tabler/icons-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { usePurchaseOrder } from '@/providers/purchasr-order-provider';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { currency, distance, hours, percent } from '@/utils/number';

interface GrowthData {
  current: number;
  growth: number;
  previous: number;
}

interface OverviewData {
  expense: GrowthData;
  approved_hours: GrowthData;
  approved_mileage: GrowthData;
  total_cost: GrowthData;
}

export function Overview() {
  const purchase_order = usePurchaseOrder();

  const [data, setData] = useState<OverviewData|null>(null);

  useEffect(() => {
    axios.get(`/api/v1/purchase-orders/${purchase_order?.id}/overview`).then((response) => {
      setData(response.data['data']);
    });
  }, [purchase_order?.id]);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-2 gap-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs 2xl:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Expense</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {
              currency(data?.expense.current ?? 0)
            }
          </CardTitle>
          <CardAction className={'self-end'}>
            <GrowthRate value={data?.expense.growth ?? 0}/>
          </CardAction>
        </CardHeader>
        <CardFooter className="hidden flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Trending up this month <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Visitors for the last 6 months</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Approved Hours</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {
              hours(data?.approved_hours.current ?? 0)
            }
          </CardTitle>
          <CardAction className={'self-end'}>
            <GrowthRate value={data?.approved_hours.growth ?? 0}/>
          </CardAction>
        </CardHeader>
        <CardFooter className="hidden flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Down 20% this period <IconTrendingDown className="size-4" />
          </div>
          <div className="text-muted-foreground">Acquisition needs attention</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Approve Mileage</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {
              distance(data?.approved_mileage.current ?? 0, purchase_order?.mileage_unit ?? 'km')
            }
          </CardTitle>
          <CardAction className={'self-end'}>
            <GrowthRate value={data?.approved_mileage.growth ?? null}/>
          </CardAction>
        </CardHeader>
        <CardFooter className="hidden flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strong user retention <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Engagement exceed targets</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Spend</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {
              currency(data?.total_cost.current ?? 0)
            }
          </CardTitle>
          <CardAction className={'self-end'}>
            <GrowthRate value={data?.total_cost.growth ?? null}/>
          </CardAction>
        </CardHeader>
        <CardFooter className="hidden flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Steady performance increase <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Meets growth projections</div>
        </CardFooter>
      </Card>
    </div>
  );
}

export function GrowthRate(props: { value: number | null}) {
  if (props.value === null) {
    return <Badge variant="outline">N/A</Badge>;
  }
  if (props.value >= 0) {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <IconTrendingUp />
        {percent(props.value)}
      </Badge>
    );
  } else {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <IconTrendingDown />
        {percent(-props.value)}
      </Badge>
    );
  }
}
