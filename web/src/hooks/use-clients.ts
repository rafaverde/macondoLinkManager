import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export interface Client {
  id: string;
  name: string;
}

export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data } = await api.get<Client[]>("/clients");
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
}
