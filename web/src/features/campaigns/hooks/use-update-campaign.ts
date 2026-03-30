import { api } from "@/lib/api";
import {
  invalidateCampaignsData,
  invalidateLinksData,
} from "@/features/shared/cache/query-invalidation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateCampaignData {
  id: string;
  name: string;
}

export function useUpdateCampaign(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name }: UpdateCampaignData) => {
      const { data } = await api.put(`/campaigns/${id}`, { name });
      return data;
    },
    onSuccess: () => {
      toast.success("Campanha alterada com sucesso!");
      void invalidateCampaignsData(queryClient, clientId);
      void invalidateLinksData(queryClient, { clientId });
    },
    onError: () => {
      toast.error(
        "Erro ao atualizar dados da campanha. Tente novamente mais tarde.",
      );
    },
  });
}
