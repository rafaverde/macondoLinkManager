import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface Campaign {
  id: string;
  name: string;
}

export function useCampaigns() {
  return useQuery({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const { data } = await api.get<Campaign[]>("/campaigns");
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
