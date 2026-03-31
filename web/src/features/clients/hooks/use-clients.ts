import { api } from "@/lib/api";
import { queryKeys } from "@/features/shared/cache/query-keys";
import { ClientListItem } from "@/types/clients";
import { PaginatedResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";

interface UseClientsParams {
  search?: string;
  page?: number;
  pageSize?: number;
}

export function useClients({
  search,
  page = 1,
  pageSize = 20,
}: UseClientsParams = {}) {
  return useQuery({
    queryKey: queryKeys.clients.list({ search, page, pageSize }),
    queryFn: async () => {
      const { data } = await api.get<PaginatedResponse<ClientListItem>>(
        "/clients",
        {
          params: { search, page, pageSize },
        },
      );
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
