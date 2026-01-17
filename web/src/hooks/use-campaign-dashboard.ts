import { api } from "@/lib/api";
import { OverviewMetrics } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useCampaignDashboard(campaignId: string) {
  return useQuery({
    queryKey: ["dashboard", "campaign", campaignId],
    queryFn: async () => {
      const { data } = await api.get<OverviewMetrics>(
        `/dashboard/campaigns/${campaignId}/overview`,
      );

      return data;
    },
    enabled: !!campaignId,
    staleTime: 1000 * 60 * 1,
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
}
