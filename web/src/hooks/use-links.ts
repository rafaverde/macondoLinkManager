import { api } from "@/lib/api";
import { Link } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface useLinksParams {
  clientId?: string;
  campaignId?: string;
}

export function useLinks({ clientId, campaignId }: useLinksParams = {}) {
  return useQuery({
    // Filtros na queryKey, caso mude refaz a busca
    queryKey: ["links", { clientId, campaignId }],
    queryFn: async () => {
      const { data } = await api.get<Link[]>("/links", {
        params: { clientId, campaignId },
      });

      return data;
    },
  });
}
