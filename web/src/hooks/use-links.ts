import { api } from "@/lib/api";
import { Link } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface useLinksParams {
  clientId?: string;
  campaignId?: string;
  search?: string;
}

export function useLinks({
  clientId,
  campaignId,
  search,
}: useLinksParams = {}) {
  return useQuery({
    // Filtros na queryKey, caso mude refaz a busca
    queryKey: ["links", { clientId, campaignId, search }],
    queryFn: async () => {
      const { data } = await api.get<Link[]>("/links", {
        params: { clientId, campaignId, search },
      });

      return data;
    },
  });
}
