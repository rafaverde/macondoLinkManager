import { api } from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { Link } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useLink(linkId: string) {
  return useQuery({
    queryKey: queryKeys.links.detail(linkId),
    queryFn: async () => {
      const { data } = await api.get<Link>(`/links/${linkId}`);
      return data;
    },
    enabled: !!linkId,
  });
}
