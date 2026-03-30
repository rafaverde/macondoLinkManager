import { api } from "@/lib/api";
import { queryKeys } from "@/features/shared/cache/query-keys";
import { CampaignListItem } from "@/types/campaigns";
import { useQuery } from "@tanstack/react-query";

export function useCampaigns(clientId?: string) {
  return useQuery({
    queryKey: queryKeys.campaigns.list(clientId),
    queryFn: async () => {
      const { data } = await api.get<CampaignListItem[]>("/campaigns", {
        params: { clientId },
      });
      return data;
    },
    enabled: clientId !== "",
    staleTime: 1000 * 60 * 5,
  });
}
