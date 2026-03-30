import { api } from "@/lib/api";
import { queryKeys } from "@/features/shared/cache/query-keys";
import { Client } from "@/types/clients";
import { useQuery } from "@tanstack/react-query";

export function useClient(clientId: string) {
  return useQuery({
    queryKey: queryKeys.clients.detail(clientId),
    queryFn: async () => {
      const { data } = await api.get<Client>(`/clients/${clientId}`);
      return data;
    },
    enabled: !!clientId,
  });
}
