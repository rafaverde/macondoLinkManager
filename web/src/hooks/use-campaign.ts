import { useQuery } from "@tanstack/react-query";

export interface Campaign {
  id: string;
  name: string;
  clientId: string;
  client?: {
    id: string;
    name: string;
  };
}

export function useCampaign(campaignId: string) {
  return useQuery({
    queryKey: ["campaign", campaignId],
    queryFn: async () => {
      const { data } = await api.get(``);
    },
  });
}
