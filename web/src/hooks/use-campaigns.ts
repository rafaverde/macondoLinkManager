import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface Campaign {
  id: string;
  name: string;
  createdAt: string;
  clientId: string;
}

export function useCampaigns(clientId?: string) {
  return useQuery({
    queryKey: ["campaigns", clientId],
    queryFn: async () => {
      const { data } = await api.get<Campaign[]>("/campaigns", {
        params: { clientId },
      });
      return data;
    },
    enabled: clientId !== "",
    staleTime: 1000 * 60 * 5,
  });
}
