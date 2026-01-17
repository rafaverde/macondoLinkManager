import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface Client {
  id: string;
  name: string;
  createdAt: string;
}

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
