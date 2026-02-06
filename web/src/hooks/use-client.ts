import { api } from "@/lib/api";
import { Client } from "@/types/clients";
import { useQuery } from "@tanstack/react-query";

export function useClient(clientId: string) {
  return useQuery({
    queryKey: ["client", clientId],
    queryFn: async () => {
      const { data } = await api.get<Client>(`/clients/${clientId}`);
      return data;
    },
    enabled: !!clientId,
  });
}
