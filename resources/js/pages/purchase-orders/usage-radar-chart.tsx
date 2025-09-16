import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from 'recharts';

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { month: 'Hours', usage: 0.8 },
  { month: 'Travel', usage: 0.5 },
  { month: 'Budget', usage: 1.3 },
];

const chartConfig = {
  usage: {
    label: 'Usage',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

export function UsageRadarChart() {
  return (
    <div className={'bg-muted/40 pt-8'}>
      <p className={'text-center'}>demo</p>
      <ChartContainer config={chartConfig} className={'mx-auto max-h-[300px]'}>
        <RadarChart data={chartData}>
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <PolarAngleAxis dataKey="month" />
          <PolarGrid />
          <Radar dataKey="usage" fill="var(--color-usage)" fillOpacity={0.6} />
        </RadarChart>
      </ChartContainer>
    </div>
  );
}
