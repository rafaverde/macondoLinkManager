"use client";

import CardNumbers from "@/components/card-numbers";
import { ClicksAreaChart } from "@/components/charts/clicks-area-chart";
import { Top5PieChart } from "@/components/charts/top-5-pie-chart";
import { Skeleton } from "@/components/ui/skeleton";
import { useClientDashboard } from "@/hooks/use-client-dashboard";
import { sumLastDays } from "@/lib/utils";
import { RiLinkUnlink } from "@remixicon/react";
import { useParams } from "next/navigation";

export default function ClientDashboardPage() {
  const { clientId } = useParams<{ clientId: string }>();
  console.log(clientId);
  const { data, isLoading, isError } = useClientDashboard(clientId);

  // Cliques 7 dias
  const last7DaysClicks = data ? sumLastDays(data.charts.clicksByDate, 7) : 0;

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Se der erro, mostra algo simples
  if (isError || !data) {
    return (
      <div className="text-foreground flex h-full w-full flex-col items-center justify-center gap-4">
        <RiLinkUnlink className="text-primary size-12" />
        Erro ao carregar dados. Tente novamente mais tarde.
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center justify-between border-b pb-8">
        <h2 className="text-4xl font-bold">Resultados do cliente</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 py-8 lg:grid-cols-3">
        <CardNumbers
          title="Total de Cliques"
          value={data.summary.totalClicks}
          description="clique(s) em todo o período"
        />
        <CardNumbers
          title="Links Ativos"
          value={data.summary.activeLinks}
          description="de toda a campanha"
        />
        <CardNumbers
          title="Cliques"
          value={last7DaysClicks}
          description="nos últimos 7 dias"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ClicksAreaChart
          data={data.charts.clicksByDate}
          isLoading={isLoading}
        />

        <Top5PieChart
          title="Top Navegadores"
          description="Navegadores mais utilizados"
          data={data.charts.topBrowsers}
          dataKey="count"
          nameKey="browser"
        />

        <Top5PieChart
          title="Top Países"
          description="Origem dos cliques"
          data={data.charts.topCountries}
          dataKey="count"
          nameKey="country"
        />

        <Top5PieChart
          title="Top Cidades"
          description="Origem dos cliques"
          data={data.charts.topCities}
          dataKey="count"
          nameKey="city"
        />
      </div>
    </>
  );
}

// Componente simples de Loading State
function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-4 w-[300px]" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-[120px] rounded-xl" />
        <Skeleton className="h-[120px] rounded-xl" />
      </div>
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        <Skeleton className="h-[300px] rounded-xl" />
      </div>
    </div>
  );
}
