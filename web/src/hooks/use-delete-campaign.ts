import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteCampaign(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignId: string) => {
      await api.delete(`/campaigns/${campaignId}`);
    },
    onSuccess: () => {
      toast.warning("Campanha apagada e seus links desassociados!");
      queryClient.invalidateQueries({ queryKey: ["campaigns", clientId] });
      queryClient.invalidateQueries({ queryKey: ["links"] });
    },
    onError: () => {
      toast.error("Erro ao excluir a campanha. Tente novamente mais tarde.");
    },
  });
}
