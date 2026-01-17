import { api } from "@/lib/api";
import { OverviewMetrics, TopClient } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useDashboardMetrics() {
  // Overview (Linhas gerais)
  const overviewQuery = useQuery({
    queryKey: ["dashboard", "overview"],
    queryFn: async () => {
      const { data } = await api.get<OverviewMetrics>("/dashboard/overview");
      return data;
    },
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // Top Clients
  const topClientsQuery = useQuery({
    queryKey: ["dashboard", "top-clients"],
    queryFn: async () => {
      const { data } = await api.get<TopClient[]>("/dashboard/top-clients");
      return data;
    },
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return {
    topClients: topClientsQuery,
    overview: overviewQuery,
    isLoading: topClientsQuery.isLoading || overviewQuery.isLoading,
    isError: topClientsQuery.isError || overviewQuery.isError,
  };
}
