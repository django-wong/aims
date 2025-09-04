"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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
import { useEffect, useState } from 'react';
import { usePurchaseOrder } from '@/providers/purchasr-order-provider';
import axios from 'axios';

export const description = "An interactive line chart"

interface ChartData {
  date: string;
  hours: number;
  travel_distance: number;
  total_expense: number;
}

const chartConfig = {
  views: {
    label: "Page Views",
  },
  hours: {
    label: "Hours",
    color: "var(--chart-1)",
  },
  travel_distance: {
    label: "Travel",
    color: "var(--chart-2)",
  },
  total_expense: {
    label: "Expenses",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function DailyHoursUsage() {
  const [activeChart, setActiveChart] = React.useState<keyof typeof chartConfig>("hours")

  const purchase_order = usePurchaseOrder();

  const [data, setData] = useState<ChartData[]>(() => {
    // Initialize with empty data for the past 30 days
    const initialData: ChartData[] = []
    const today = new Date()
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      initialData.push({
        date: date.toISOString().split("T")[0],
        hours: 0,
        travel_distance: 0,
        total_expense: 0,
      })
    }
    return initialData
  });

  const total = React.useMemo(
    () => ({
      hours: data.reduce((acc, curr) => acc + curr.hours, 0),
      travel_distance: data.reduce((acc, curr) => acc + curr.travel_distance, 0),
      total_expense: data.reduce((acc, curr) => acc + curr.total_expense, 0),
    }),
    [data]
  );


  useEffect(() => {
    axios.get(`/api/v1/purchase-orders/${purchase_order?.id}/daily-usage`).then((response) => {
      if (response) {
        setData(response.data['data']);
      }
    })
  }, [purchase_order?.id])

  return (
    <Card className="py-4 sm:py-0">
      <CardHeader className="flex flex-col items-stretch border-b !p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
          <CardTitle className={'line-clamp-1'}>Daily Usage</CardTitle>
          <CardDescription className={'line-clamp-1'}>
            Showing in last month across all assignments including unapproved.
          </CardDescription>
        </div>
        <div className="flex">
          {["hours", "travel_distance", 'total_expense'].map((key) => {
            const chart = key as keyof typeof chartConfig
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="data-[active=true]:bg-muted/50 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l sm:border-t-0 sm:border-l sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-muted-foreground text-xs">
                  {chartConfig[chart].label}
                </span>
                <span className="text-lg leading-none font-bold sm:text-3xl">
                  {total[key as keyof typeof total].toLocaleString()}
                </span>
              </button>
            )
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={activeChart}
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  }}
                />
              }
            />
            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
