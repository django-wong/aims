import { TrendingUp } from "lucide-react"
import { CartesianGrid, LabelList, Line, LineChart, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useTableApi } from '@/components/data-table-2';

export function ApprovalEfficiencyChart() {
  const {
    data
  } = useTableApi();

  if (data.length === 0) {
    return null;
  }

  console.info(data);

  const chartConfig = {
    min: {
      label: "Min",
      color: "var(--chart-1)",
    },
    max: {
      label: "Max",
      color: "var(--chart-2)",
    },
    avg: {
      label: "Average",
      color: "var(--chart-3)",
    },
    total: {
      label: "Total Approval",
      color: "var(--chart-4)",
    },
  } satisfies ChartConfig;

  const chartData = data.map((item) => {
    return {
      client_code: item.client_code || item.client_business_name,
      avg: item.avg_hours,
      min: item.min_hours,
      max: item.max_hours,
      total: item.total_approval_in_last_year,
    };
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Approval Efficiency</CardTitle>
        <CardDescription>Showing data from recent year</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className={'aspect-[16/3]'} config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="client_code"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              allowDataOverflow={true}
              tickFormatter={(value) => value}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Line
              dataKey="min"
              type="monotone"
              stroke="var(--color-min)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="max"
              type="monotone"
              stroke="var(--color-max)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="avg"
              type="monotone"
              stroke="var(--color-avg)"
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey="total"
              type="monotone"
              stroke="var(--color-total)"
              strokeWidth={2}
              dot={false}
            />
            <LabelList
              position="top"
              offset={12}
              className="fill-foreground"
              fontSize={12}
              dataKey="browser"
              formatter={(value: keyof typeof chartConfig) =>
                chartConfig[value]?.label
              }
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
