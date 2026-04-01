import { api } from "@/lib/api";
import { queryKeys } from "@/features/shared/cache/query-keys";
import { CampaignListItem } from "@/types/campaigns";
import { PaginatedResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface UseCampaignsParams {
  clientId?: string;
  page?: number;
  pageSize?: number;
}

export function useCampaigns({
  clientId,
  page = 1,
  pageSize = 20,
}: UseCampaignsParams = {}) {
  return useQuery({
    queryKey: queryKeys.campaigns.list({ clientId, page, pageSize }),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<CampaignListItem>>(
        "/campaigns",
        {
          params: { clientId, page, pageSize },
        },
      );
      return data;
    },
    enabled: clientId !== "",
    staleTime: 1000 * 60 * 5,
  });
}
