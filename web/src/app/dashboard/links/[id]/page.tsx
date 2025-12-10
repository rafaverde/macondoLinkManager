"use client";

import LinkCard from "@/components/link-card";
import LinkCardSkeleton from "@/components/link-card-skeleton";
import { Button } from "@/components/ui/button";
import { RiArrowLeftLine, RiLinkUnlink } from "@remixicon/react";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useLink } from "@/hooks/use-link";
import CardNumbers from "@/components/card-numbers";
import { useLinkMetrics } from "@/hooks/use-link-metrics";
import { ClicksAreaChart } from "@/components/charts/clicks-area-chart";
import { Top5PieChart } from "@/components/charts/top-5-pie-chart";

export default function LinkDetailsPage() {
  const params = useParams();
  const linkId = params.id as string;

  // Busca dados do link
  const {
    data: link,
    isLoading: isLoadingLink,
    isError: isLinkError,
  } = useLink(linkId);

  // Busca métricas do link
  const { data: metrics, isLoading: isLoadingMetrics } = useLinkMetrics(linkId);

  console.log(metrics);

  // Cliques de hoje
  const todayDate = new Date().toISOString().split("T")[0];
  const todayClicks =
    metrics?.clicksByDate.find((item) => item.date.startsWith(todayDate))
      ?.count || 0;

  // Cliques 7 dias
  const last7DaysClicks =
    metrics?.clicksByDate
      .filter((item) => {
        const itemDate = new Date(item.date);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return itemDate >= sevenDaysAgo;
      })
      .reduce((acc, item) => acc + item.count, 0) || 0;

  return (
    <>
      <div className="flex items-center justify-between border-b pb-8">
        <h2 className="text-4xl font-bold">Detalhes do link</h2>
        <Link href="/dashboard/links">
          <Button size="lg">
            Voltar
            <RiArrowLeftLine />
          </Button>
        </Link>
      </div>

      <div className="flex flex-col gap-4">
        {isLoadingLink ? (
          <div className="flex flex-col gap-4 pt-8">
            <LinkCardSkeleton />
          </div>
        ) : isLinkError || !link ? (
          <div className="flex h-full flex-col items-center justify-center py-10 text-center">
            <RiLinkUnlink className="text-primary mb-6 size-16" />
            <h2 className="text-destructive text-xl font-bold">
              Erro ao carregar link
            </h2>
            <p className="text-muted-foreground mb-4">
              O link pode ter sido removido ou você não tem permissão.
            </p>
            <Button asChild variant="outline">
              <Link href="/dashboard/links">Voltar para lista</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 pt-8">
            <LinkCard link={link} />
          </div>
        )}

        {/* Cards totais */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <CardNumbers
            title="Total de cliques"
            description="clique(s) em todo o período"
            value={link?._count?.clicks}
            isLoading={isLoadingLink}
          />
          <CardNumbers
            title="Cliques de hoje"
            description="clique(s) no período do dia atual"
            value={todayClicks}
            isLoading={isLoadingLink}
          />
          <CardNumbers
            title="Últimos 7 dias"
            description="clique(s) nos últimos 7 dias"
            value={last7DaysClicks}
            isLoading={isLoadingLink}
          />
        </div>

        {/* Gráfico últimos 30 dias */}
        <div>
          <ClicksAreaChart
            data={metrics?.clicksByDate}
            isLoading={isLoadingMetrics}
          />
        </div>

        {/* Gráficos secundários (Pizza) */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Gráfico navegadores */}
          <Top5PieChart
            title="Top 5 Navegadores"
            description="Navegadores mais utilizados"
            data={metrics?.topBrowsers}
            dataKey="count"
            nameKey="browser"
            isLoading={isLoadingMetrics}
          />

          {/* Gráfico localizações */}
          <Top5PieChart
            title="Top 5 Localizações"
            description="Regiões com mais acessos (IP)"
            data={metrics?.topLocations}
            dataKey="count"
            nameKey="ip"
          />
        </div>
      </div>
    </>
  );
}
