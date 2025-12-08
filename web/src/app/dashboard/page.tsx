"use client";

import { TopClientsChart } from "@/components/charts/top-clients-chart";
import { Button } from "@/components/ui/button";
import CardNumbers from "@/components/card-numbers";
import { Skeleton } from "@/components/ui/skeleton";
import { useDashboardMetrics } from "@/hooks/use-dashboard-metrics";
import { RiArrowRightLine } from "@remixicon/react";

export default function DashboardPage() {
  const { general, topClients, isLoading } = useDashboardMetrics();

  // Dados fictícios para o Skeleton não quebrar o layout visualmente
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Se der erro, mostra algo simples (pode melhorar depois)
  if (general.isError || topClients.isError) {
    return <div className="text-destructive">Erro ao carregar dados.</div>;
  }

  return (
    <>
      <div className="flex items-center justify-between border-b pb-8">
        <h2 className="text-4xl font-bold">Resultados gerais</h2>
        <Button size="lg">
          Novo Link
          <RiArrowRightLine />
        </Button>
      </div>

      <div className="grid grid-cols-1 grid-rows-2 space-y-4 py-8 lg:grid-cols-3 lg:gap-4 lg:space-y-0">
        <div className="flex w-full flex-col gap-4 lg:col-span-1">
          <CardNumbers
            title="Total de Cliques"
            value={general.data?.totalClicks}
          />
          <CardNumbers title="Links Ativos" value={general.data?.activeLinks} />
        </div>

        <TopClientsChart data={topClients.data} className="col-span-2" />
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
