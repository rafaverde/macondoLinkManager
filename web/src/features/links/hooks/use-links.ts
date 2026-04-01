import { api } from "@/lib/api";
import { queryKeys } from "@/features/shared/cache/query-keys";
import { Link, PaginatedResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface useLinksParams {
  clientId?: string;
  campaignId?: string;
  search?: string;
  page?: number;
  pageSize?: number;
}

export function useLinks({
  clientId,
  campaignId,
  search,
  page = 1,
  pageSize = 20,
}: useLinksParams = {}) {
  return useQuery({
    queryKey: queryKeys.links.list({ clientId, campaignId, search, page, pageSize }),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<Link>>("/links", {
        params: { clientId, campaignId, search, page, pageSize },
      });

      return data;
    },
  });
}
