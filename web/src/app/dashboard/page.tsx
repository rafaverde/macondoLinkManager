"use client";

import { TopClientsChart } from "@/components/charts/top-clients-chart";
import { Button } from "@/components/ui/button";
import CardNumbers from "@/components/card-numbers";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics";
import { RiArrowRightLine, RiLinkUnlink } from "@remixicon/react";
import Link from "next/link";
import { Top5PieChart } from "@/components/charts/top-5-pie-chart";
import { useBreadcrumb } from "@/contexts/breadcrumb-context";
import { useEffect } from "react";
import ModeToggle from "@/components/ui/mode-toggle";

export default function DashboardPage() {
  const { setItems } = useBreadcrumb();
  const { topClients, overview, isLoading, isError } = useDashboardMetrics();

  // Gera breadcrumb
  useEffect(() => {
    setItems([{ label: "Dashboard", href: "/dashboard" }]);
  }, [setItems]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Se der erro, mostra algo simples (pode melhorar depois)
  if (isError) {
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
        <h2 className="text-4xl font-bold">Resultados gerais</h2>
        <Link href="/dashboard/links/create">
          <Button size="lg">
            Novo Link
            <RiArrowRightLine />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 grid-rows-2 space-y-4 py-8 lg:grid-cols-3 lg:grid-rows-1 lg:gap-4 lg:space-y-0">
        <div className="flex w-full flex-col gap-4 lg:col-span-1">
          <CardNumbers
            title="Total de Cliques"
            value={overview.data?.summary.totalClicks}
          />
          <CardNumbers
            title="Links Ativos"
            value={overview.data?.summary.activeLinks}
          />
        </div>

        <TopClientsChart data={topClients.data} className="col-span-2" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Top5PieChart
          title="Top 5 Navegadores"
          description="Navegadores mais utilizados nos últimos 30 dias em todos os links."
          data={overview?.data?.charts.topBrowsers}
          dataKey="count"
          nameKey="browser"
          centerLabel="Cliques"
          isLoading={isLoading}
        />

        <Top5PieChart
          title="Top 5 Localizações"
          description="Origem de todos os cliques."
          data={overview?.data?.charts.topCountries}
          dataKey="count"
          nameKey="country"
          centerLabel="Cliques"
          isLoading={isLoading}
        />
      </div>
    </>
  );

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
}
