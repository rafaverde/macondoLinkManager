import { api } from "@/lib/api";
import { OverviewMetrics } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useClientDashboard(clientId: string) {
  return useQuery({
    queryKey: ["dashboard", "client", clientId],
    queryFn: async () => {
      const { data } = await api.get<OverviewMetrics>(
        `/dashboard/clients/${clientId}/overview`,
      );
      return data;
    },
    enabled: !!clientId,
  });
}
