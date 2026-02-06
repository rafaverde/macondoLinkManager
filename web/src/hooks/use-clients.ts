import { api } from "@/lib/api";
import { ClientListItem } from "@/types/clients";
import { useQuery } from "@tanstack/react-query";

export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data } = await api.get<ClientListItem[]>("/clients");
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
