"use client"

import * as React from "react"
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

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
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export const description = "An interactive area chart"

const chartData = [
  { date: "2024-04-01", work: 2, travel: 1, remote: 0, },
  { date: "2024-04-02", work: 9, travel: 1, remote: 0, },
  { date: "2024-04-03", work: 1, travel: 1, remote: 0, },
  { date: "2024-04-04", work: 2, travel: 2, remote: 0, },
  { date: "2024-04-05", work: 3, travel: 2, remote: 0, },
  { date: "2024-04-06", work: 3, travel: 3, remote: 0, },
  { date: "2024-04-07", work: 2, travel: 1, remote: 0, },
  { date: "2024-04-08", work: 4, travel: 3, remote: 3, },
  { date: "2024-04-09", work: 5, travel: 1, remote: 0, },
  { date: "2024-04-10", work: 2, travel: 1, remote: 0, },
  { date: "2024-04-11", work: 3, travel: 3, remote: 0, },
  { date: "2024-04-12", work: 2, travel: 2, remote: 0, },
  { date: "2024-04-13", work: 3, travel: 3, remote: 0, },
  { date: "2024-04-14", work: 1, travel: 2, remote: 0, },
  { date: "2024-04-15", work: 1, travel: 1, remote: 0, },
  { date: "2024-04-16", work: 1, travel: 1, remote: 0, },
  { date: "2024-04-17", work: 4, travel: 3, remote: 0, },
  { date: "2024-04-18", work: 3, travel: 4, remote: 0, },
  { date: "2024-04-19", work: 2, travel: 1, remote: 3, },
  { date: "2024-04-20", work: 8, travel: 1, remote: 0, },
  { date: "2024-04-21", work: 1, travel: 2, remote: 0, },
  { date: "2024-04-22", work: 2, travel: 1, remote: 0, },
  { date: "2024-04-23", work: 1, travel: 2, remote: 0, },
  { date: "2024-04-24", work: 3, travel: 2, remote: 0, },
  { date: "2024-04-25", work: 2, travel: 2, remote: 0, },
  { date: "2024-04-26", work: 7, travel: 1, remote: 0, },
  { date: "2024-04-27", work: 3, travel: 4, remote: 0, },
  { date: "2024-04-28", work: 1, travel: 1, remote: 0, },
  { date: "2024-04-29", work: 3, travel: 2, remote: 0, },
  { date: "2024-04-30", work: 4, travel: 3, remote: 0, },
  { date: "2024-05-01", work: 1, travel: 2, remote: 0, },
  { date: "2024-05-02", work: 2, travel: 3, remote: 2, },
  { date: "2024-05-03", work: 2, travel: 1, remote: 0, },
  { date: "2024-05-04", work: 3, travel: 4, remote: 0, },
  { date: "2024-05-05", work: 4, travel: 3, remote: 0, },
  { date: "2024-05-06", work: 4, travel: 5, remote: 0, },
  { date: "2024-05-07", work: 3, travel: 3, remote: 5, },
  { date: "2024-05-08", work: 1, travel: 2, remote: 0, },
  { date: "2024-05-09", work: 2, travel: 1, remote: 0, },
  { date: "2024-05-10", work: 2, travel: 3, remote: 0, },
  { date: "2024-05-11", work: 3, travel: 2, remote: 0, },
  { date: "2024-05-12", work: 1, travel: 2, remote: 0, },
  { date: "2024-05-13", work: 1, travel: 1, remote: 3, },
  { date: "2024-05-14", work: 4, travel: 4, remote: 0, },
  { date: "2024-05-15", work: 4, travel: 3, remote: 0, },
  { date: "2024-05-16", work: 3, travel: 4, remote: 0, },
  { date: "2024-05-17", work: 4, travel: 4, remote: 0, },
  { date: "2024-05-18", work: 3, travel: 3, remote: 0, },
  { date: "2024-05-19", work: 2, travel: 1, remote: 0, },
  { date: "2024-05-20", work: 1, travel: 2, remote: 0, },
  { date: "2024-05-21", work: 8, travel: 1, remote: 0, },
  { date: "2024-05-22", work: 8, travel: 1, remote: 0, },
  { date: "2024-05-23", work: 2, travel: 2, remote: 0, },
  { date: "2024-05-24", work: 2, travel: 2, remote: 0, },
  { date: "2024-05-25", work: 2, travel: 2, remote: 0, },
  { date: "2024-05-26", work: 2, travel: 1, remote: 0, },
  { date: "2024-05-27", work: 4, travel: 4, remote: 0, },
  { date: "2024-05-28", work: 2, travel: 1, remote: 0, },
  { date: "2024-05-29", work: 7, travel: 1, remote: 0, },
  { date: "2024-05-30", work: 3, travel: 2, remote: 0, },
  { date: "2024-05-31", work: 1, travel: 2, remote: 0, },
  { date: "2024-06-01", work: 1, travel: 2, remote: 0, },
  { date: "2024-06-02", work: 4, travel: 4, remote: 0, },
  { date: "2024-06-03", work: 1, travel: 1, remote: 0, },
  { date: "2024-06-04", work: 4, travel: 3, remote: 0, },
  { date: "2024-06-05", work: 8, travel: 1, remote: 0, },
  { date: "2024-06-06", work: 2, travel: 2, remote: 0, },
  { date: "2024-06-07", work: 3, travel: 3, remote: 0, },
  { date: "2024-06-08", work: 3, travel: 3, remote: 0, },
  { date: "2024-06-09", work: 4, travel: 4, remote: 0, },
  { date: "2024-06-10", work: 1, travel: 2, remote: 0, },
  { date: "2024-06-11", work: 9, travel: 1, remote: 0, },
  { date: "2024-06-12", work: 4, travel: 4, remote: 0, },
  { date: "2024-06-13", work: 8, travel: 1, remote: 0, },
  { date: "2024-06-14", work: 4, travel: 3, remote: 0, },
  { date: "2024-06-15", work: 3, travel: 3, remote: 0, },
  { date: "2024-06-16", work: 3, travel: 3, remote: 0, },
  { date: "2024-06-17", work: 4, travel: 5, remote: 0, },
  { date: "2024-06-18", work: 1, travel: 1, remote: 0, },
  { date: "2024-06-19", work: 3, travel: 2, remote: 0, },
  { date: "2024-06-20", work: 4, travel: 4, remote: 0, },
  { date: "2024-06-21", work: 1, travel: 2, remote: 0, },
  { date: "2024-06-22", work: 3, travel: 2, remote: 0, },
  { date: "2024-06-23", work: 4, travel: 5, remote: 0, },
  { date: "2024-06-24", work: 1, travel: 1, remote: 0, },
  { date: "2024-06-25", work: 1, travel: 1, remote: 0, },
  { date: "2024-06-26", work: 4, travel: 3, remote: 0, },
  { date: "2024-06-27", work: 4, travel: 4, remote: 0, },
  { date: "2024-06-28", work: 1, travel: 2, remote: 0, },
  { date: "2024-06-29", work: 1, travel: 1, remote: 0, },
  { date: "2024-06-30", work: 4, travel: 4, remote: 0, },
]

const chartConfig = {
  visitors: {
    label: "Hours",
  },
  work: {
    label: "Work",
    color: "var(--chart-1)",
  },
  travel: {
    label: "Travel",
    color: "var(--chart-2)",
  },
  remote: {
    label: "Remote",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig

export function DailyUsage() {
  const [timeRange, setTimeRange] = React.useState("90d")

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const referenceDate = new Date("2024-06-30")
    let daysToSubtract = 90
    if (timeRange === "30d") {
      daysToSubtract = 30
    } else if (timeRange === "7d") {
      daysToSubtract = 7
    }
    const startDate = new Date(referenceDate)
    startDate.setDate(startDate.getDate() - daysToSubtract)
    return date >= startDate
  })

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Hours by Type</CardTitle>
          <CardDescription>
            Showing daily usage for the last 3 months
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart data={filteredData} stackOffset={'positive'}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-work)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-work)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-travel)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-travel)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillRemote" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-remote)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-remote)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
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
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }}
                  indicator="dot"
                />
              }
            />
            <Bar
              dataKey="travel"
              type="step"
              fill="var(--color-travel)"
              stackId="a"
            />
            <Bar
              dataKey="work"
              type="step"
              fill="var(--color-work)"
              stackId="a"
            />
            <Bar
              dataKey="remote"
              type="step"
              fill="var(--color-remote)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
