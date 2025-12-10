import * as React from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { RiEmotionUnhappyLine, RiLineChartLine } from "@remixicon/react";
import { cn } from "@/lib/utils";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { Skeleton } from "../ui/skeleton";

export interface ClicksData {
  date: string;
  count: number;
}

interface ClicksAreaChartProps extends React.ComponentProps<typeof Card> {
  data?: ClicksData[];
  isLoading?: boolean;
}

const chartConfig = {
  count: {
    label: "Cliques",
    color: "var(--color-primary)",
  },
} satisfies ChartConfig;

export function ClicksAreaChart({
  data,
  className,
  isLoading,
  ...props
}: ClicksAreaChartProps) {
  // Ordena dados por data e pega apenas os últimos 30 dias, caso a api mande mais
  const chartData = React.useMemo(() => {
    if (!data) return [];

    return [...data].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );
  }, [data]);

  return (
    <Card className={cn("shadow-xs hover:shadow-sm", className)} {...props}>
      <CardHeader>
        <CardTitle>Evolução de cliques</CardTitle>
        <CardDescription>
          Visualizando desempenho diário do link. (Últimos 30 dias.)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="flex h-[300px] w-full items-center justify-center">
            <RiLineChartLine className="size-12 opacity-20" />
          </Skeleton>
        ) : !data || chartData.length === 0 ? (
          <div className="text-muted-foreground bg-muted/50 flex flex-row items-center justify-center gap-2 rounded-2xl py-24">
            <RiEmotionUnhappyLine className="text-primary" />
            <p> Ainda não há dados suficientes para montar o gráfico.</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[300px] w-full"
          >
            <AreaChart
              accessibilityLayer
              data={chartData}
              margin={{ left: 12, right: 12, top: 12, bottom: 12 }}
            >
              <defs>
                <linearGradient id="fillClicks" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-count)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-count)"
                    stopOpacity={0.05}
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
                  const date = new Date(value);
                  return date.toLocaleDateString("pt-BR", {
                    day: "numeric",
                    month: "short",
                  });
                }}
              />

              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                allowDecimals={false} // Não mostra 1.5 cliques
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    labelFormatter={(value) => {
                      return new Date(value)
                        .toLocaleDateString("pt-BR", {
                          weekday: "short",
                          day: "numeric",
                          month: "short",
                        })
                        .toUpperCase();
                    }}
                  />
                }
              />

              <Area
                dataKey="count"
                type="monotone" // Curva suave
                fill="url(#fillClicks)" // Usa o gradiente definido acima
                fillOpacity={0.6}
                stroke="var(--color-count)"
                strokeWidth={1}
                strokeOpacity={0.6}
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
