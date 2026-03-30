import { api } from "@/lib/api";
import {
  invalidateCampaignsData,
  invalidateLinksData,
} from "@/features/shared/cache/query-invalidation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignId: string) => {
      await api.delete(`/campaigns/${campaignId}`);
    },
    onSuccess: () => {
      toast.warning("Campanha apagada e seus links desassociados!");
      void invalidateCampaignsData(queryClient);
      void invalidateLinksData(queryClient);
    },
    onError: () => {
      toast.error("Erro ao excluir a campanha. Tente novamente mais tarde.");
    },
  });
}
