"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TopClient } from "@/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RiEmotionUnhappyLine } from "@remixicon/react";

const chartConfig = {
  clicks: {
    label: "Cliques",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

interface TopClientsChartProps extends React.ComponentProps<typeof Card> {
  data?: TopClient[];
}

export function TopClientsChart({
  data,
  className,
  ...props
}: TopClientsChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card
        className={cn(
          "text-muted-foreground flex flex-row items-center justify-center gap-2 p-6",
          className,
        )}
      >
        <RiEmotionUnhappyLine className="text-primary" />
        <p> Nenhum dado para exibir. Short links!</p>
      </Card>
    );
  }

  return (
    <Card className={cn("shadow-xs hover:shadow-sm", className)} {...props}>
      <CardHeader>
        <CardTitle>Top 5 Clientes</CardTitle>
        <CardDescription>
          Clientes com maior volume de cliques acumulados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-32 w-full">
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              right: 24,
              left: 0,
            }}
          >
            <CartesianGrid horizontal={false} />
            <XAxis type="number" dataKey="clicks" hide />
            <YAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              type="category"
              tickFormatter={(value) => value.slice(0, 10)}
              hide
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Bar dataKey="clicks" fill="var(--color-primary)" radius={4}>
              <LabelList
                dataKey="name"
                position="insideLeft"
                offset={8}
                className="fill-(--color-primary-foreground)"
                fontSize={12}
              />
              <LabelList
                dataKey="clicks"
                position="right"
                offset={8}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
