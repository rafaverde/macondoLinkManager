import { api } from "@/lib/api";
import { LinkMetrics } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useLinkMetrics(linkId: string) {
  return useQuery({
    queryKey: ["dashboard", "link", linkId],
    queryFn: async () => {
      const { data } = await api.get<LinkMetrics>(`/links/${linkId}/metrics`);
      return data;
    },
    enabled: !!linkId,
    refetchInterval: 1000 * 30,
  });
}
