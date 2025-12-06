import { api } from "@/lib/api";
import { GeneralMetrics, TopClient } from "@/types";
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

  return {
    general: generalQuery,
    topClients: topClientsQuery,
    isLoading: generalQuery.isLoading || topClientsQuery.isLoading,
    isError: generalQuery.isError || topClientsQuery.isError,
  };
}
