"use client";

import * as React from "react";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "../ui/chart";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { RiEmotionUnhappyLine, RiLineChartLine } from "@remixicon/react";
import { Cell, Label, Pie, PieChart } from "recharts";

interface GenericPieChartProps extends React.ComponentProps<typeof Card> {
  data: any[] | undefined;
  dataKey: string; //Ex.: "count"
  nameKey: string; //Ex.: "browser" or "ip"
  title: string;
  description?: string;
  isLoading?: boolean;
}

export function GenericPieChart({
  data,
  dataKey,
  nameKey,
  title,
  description,
  isLoading,
  className,
  ...props
}: GenericPieChartProps) {
  // Processa dados
  const processedData = React.useMemo(() => {
    if (!data) return [];

    // Pega os top 5 e atribui cores do tema
    return data.slice(0, 5).map((item, index) => ({
      ...item,
      // Varia entre as 5 core padrão do shadcn charts (chart-1 a chart-5)
      fill: `var(--chart-${(index % 5) + 1})`,
    }));
  }, [data]);

  // Configuração dinâmica do Chart (Shadcn)
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      [dataKey]: { label: "Total" },
    };

    // Gera labels para o tooltip baseados nos dados
    processedData.forEach((item, index) => {
      const key = item[nameKey];
      config[key] = {
        label: key,
        color: `var(--chart-${(index % 5) + 1})`,
      };
    });
    return config;
  }, [processedData, dataKey, nameKey]);

  console.log(processedData);

  // Cálculo do total para exibir no centro (Donut)
  const total = React.useMemo(() => {
    return processedData.reduce((acc, curr) => acc + (curr[dataKey] || 0), 0);
  }, [processedData, dataKey]);

  return (
    <Card className={cn("shadow-xs hover:shadow-sm", className)} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="flex h-[300px] w-full items-center justify-center">
            <RiLineChartLine className="size-12 opacity-20" />
          </Skeleton>
        ) : !data || data.length === 0 ? (
          <div className="text-muted-foreground bg-muted/50 flex flex-col items-center justify-center gap-2 rounded-2xl p-10 py-24 text-center">
            <RiEmotionUnhappyLine className="text-primary" />
            <p> Ainda não há dados suficientes para montar o gráfico.</p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="relative mx-auto aspect-square max-h-[300px] w-full"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              <Pie
                data={processedData}
                dataKey={dataKey}
                nameKey={nameKey}
                innerRadius={60}
                strokeWidth={5}
              >
                {processedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.fill}
                    stroke="var(--card)"
                  />
                ))}
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {total.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Cliques
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey={nameKey} />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
