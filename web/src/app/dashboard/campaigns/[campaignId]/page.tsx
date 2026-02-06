"use client";

import CardNumbers from "@/components/card-numbers";
import { ClicksAreaChart } from "@/components/charts/clicks-area-chart";
import { Top5PieChart } from "@/components/charts/top-5-pie-chart";
import DashboardSkeleton from "@/components/dashboard-skeleton";
import { Button } from "@/components/ui/button";
import { useBreadcrumb } from "@/contexts/breadcrumb-context";
import { useCampaign } from "@/hooks/use-campaign";
import { useCampaignDashboard } from "@/hooks/use-campaign-dashboard";
import { normalizeCity, normalizeCountry } from "@/lib/normalize-geolocation";
import { sumLastDays } from "@/lib/utils";
import { RiAddLine, RiLinksLine, RiLinkUnlink } from "@remixicon/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function CampaignDashboardPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const { data, isLoading, isError } = useCampaignDashboard(campaignId);
  const { data: campaign } = useCampaign(campaignId);
  const { setItems } = useBreadcrumb();

  // Padronizando geolocation
  const normalizedCountries = data?.charts.topCountries.map((item) => ({
    ...item,
    country: normalizeCountry(item.country),
  }));

  const normalizedCities = data?.charts.topCities.map((item) => ({
    ...item,
    country: normalizeCity(item.city),
  }));

  // Cliques 7 dias
  const last7DaysClicks = data ? sumLastDays(data.charts.clicksByDate, 7) : 0;

  useEffect(() => {
    if (!campaign) return;

    setItems([
      { label: "Dashboard", href: "/dashboard" },
      { label: "Links", href: "/dashboard/links" },
      { label: "Campanhas", href: "/dashboard/campaigns" },
      { label: "Campanha" },
      { label: campaign.name },
    ]);
  }, [campaign, setItems]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (!data) {
    return (
      <div className="text-foreground flex h-full w-full flex-col items-center justify-center gap-4">
        <RiLinksLine className="text-primary size-12" />
        <p>
          Essa campanha ainda não possui nenhum link, tente adicionar alguns!
        </p>
        <Link href="/dashboard/links/create">
          <Button>
            Novo Link <RiAddLine />
          </Button>
        </Link>
      </div>
    );
  }

  // Se der erro, mostra algo simples
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
        <h2 className="text-4xl font-bold">{campaign?.name}</h2>
      </div>

      <div className="grid grid-cols-1 gap-4 py-8 lg:grid-cols-3">
        <CardNumbers
          title="Links Ativos"
          value={data.summary.activeLinks}
          description="da campanha"
        />
        <CardNumbers
          title="Total de Cliques"
          value={data.summary.totalClicks}
          description="clique(s) em todo o período"
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
          data={normalizedCountries}
          dataKey="count"
          nameKey="country"
        />

        <Top5PieChart
          title="Top Cidades"
          description="Origem dos cliques"
          data={normalizedCities}
          dataKey="count"
          nameKey="city"
        />
      </div>
    </>
  );
}
