"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

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
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAssignment } from '@/providers/assignment-provider';

export const description = "An interactive area chart"

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

  const [timeRange, setTimeRange] = React.useState("-30 days")

  const assignment = useAssignment();

  const [data, setData] = useState<{
    date: string, // YYYY-MM-DD
    work: number,
    travel: number,
    remote: number
  }[]>([]);


  useEffect(() => {
    axios.get(`/api/v1/assignments/${assignment!.id}/daily-usage`, {
      params: {
        range: timeRange
      }
    }).then((response) => {
      setData(response.data['data']);
    });
  }, [timeRange, assignment, setData])

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
            <SelectItem value="-90 days" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="-30 days" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="-7 days" className="rounded-lg">
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
          <BarChart data={data} stackOffset={'positive'}>
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
