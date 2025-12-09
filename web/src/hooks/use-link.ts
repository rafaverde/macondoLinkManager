import { api } from "@/lib/api";
import { Link } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useLink(id: string) {
  return useQuery({
    queryKey: ["link", id],
    queryFn: async () => {
      const { data } = await api.get<Link>(`/links/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
