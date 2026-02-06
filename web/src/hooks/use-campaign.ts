import { api } from "@/lib/api";
import { Campaign } from "@/types/campaigns";
import { useQuery } from "@tanstack/react-query";

export function useCampaign(campaignId: string) {
  return useQuery({
    queryKey: ["campaign", campaignId],
    queryFn: async () => {
      const { data } = await api.get<Campaign>(`/campaigns/${campaignId}`);
      return data;
    },
    enabled: !!campaignId,
  });
}
