import { api } from "@/lib/api";
import { queryKeys } from "@/features/shared/cache/query-keys";
import { OverviewMetrics } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useClientDashboard(clientId: string) {
  return useQuery({
    queryKey: queryKeys.dashboard.client(clientId),
    queryFn: async () => {
      const { data } = await api.get<OverviewMetrics>(
        `/dashboard/clients/${clientId}/overview`,
      );
      return data;
    },
    enabled: !!clientId,
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
