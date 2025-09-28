import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { usePurchaseOrder } from '@/providers/purchasr-order-provider';

const chartConfig = {
  usage: {
    label: 'Usage',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function UsageRadarChart() {
  const purchase_order = usePurchaseOrder();

  const chartData = [
    { type: 'Hours', usage: purchase_order?.usage },
    { type: 'Travel', usage: purchase_order?.travel_usage },
    { type: 'Budget', usage: purchase_order?.budget_usage },
  ];

  return (
    <div className={'bg-muted/40 pt-8'}>
      <ChartContainer config={chartConfig} className={'mx-auto max-h-[300px]'}>
        <RadarChart data={chartData}>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <PolarAngleAxis dataKey="type" />
          <PolarGrid />
          <Radar dataKey="usage" fill="var(--color-usage)" fillOpacity={0.6} />
        </RadarChart>
      </ChartContainer>
    </div>
  );
}
