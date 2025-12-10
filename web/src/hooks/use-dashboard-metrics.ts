import { api } from "@/lib/api";
import { GeneralMetrics, OverviewMetrics, TopClient } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useDashboardMetrics() {
  // Métricas gerais
  const generalQuery = useQuery({
    queryKey: ["metrics", "general"],
    queryFn: async () => {
      const { data } = await api.get<GeneralMetrics>("/metrics/general");
      return data;
    },
  });

  // Top Clients
  const topClientsQuery = useQuery({
    queryKey: ["metrics", "top-clients"],
    queryFn: async () => {
      const { data } = await api.get<TopClient[]>("/metrics/top-clients");
      return data;
    },
  });

  // Overview (Linhas gerais)
  const overviewQuery = useQuery({
    queryKey: ["metrics", "overview"],
    queryFn: async () => {
      const { data } = await api.get<OverviewMetrics>("/metrics/overview");
      return data;
    },
  });

  return {
    general: generalQuery,
    topClients: topClientsQuery,
    overview: overviewQuery,
    isLoading:
      generalQuery.isLoading ||
      topClientsQuery.isLoading ||
      overviewQuery.isLoading,
    isError:
      generalQuery.isError || topClientsQuery.isError || overviewQuery.isError,
  };
}
