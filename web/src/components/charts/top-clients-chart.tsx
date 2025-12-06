"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { TopClient } from "@/types";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const chartConfig = {
  clicks: {
    label: "Cliques",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

interface TopClientsChartProps {
  data?: TopClient[];
}

export function TopClientsChart({ data }: TopClientsChartProps) {
  console.log(data);

  if (!data || data.length === 0) {
    return (
      <Card className="text-muted-foreground col-span-1 flex items-center justify-center p-6">
        Nenhum dado para exibir.
      </Card>
    );
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Top 5 Clientes</CardTitle>
        <CardDescription>
          Clientes com maior volume de cliques acumulados.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 10)}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="clicks"
              fill="var(--color-primary)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
