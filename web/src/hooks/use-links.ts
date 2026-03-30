import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
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
    queryKey: queryKeys.links.list({ clientId, campaignId, search }),
    queryFn: async () => {
      const { data } = await api.get<Link[]>("/links", {
        params: { clientId, campaignId, search },
      });

      return data;
    },
  });
}
