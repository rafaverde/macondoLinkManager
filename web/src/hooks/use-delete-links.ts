import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      clientId,
      campaignId,
    }: {
      id: string;
      clientId?: string;
      campaignId?: string;
    }) => {
      await api.delete(`/links/${id}`);
    },
    onSuccess: (_data, variables) => {
      toast.success("Link removido com sucesso!");

      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      if (variables.clientId) {
        queryClient.invalidateQueries({
          queryKey: ["dashboard", "client", variables.clientId],
        });
      }

      if (variables.campaignId) {
        queryClient.invalidateQueries({
          queryKey: ["dashboard", "campaign", variables.campaignId],
        });
      }
    },
    onError: () => {
      toast.error("Erro ao remover o link. Tente novamente mais tarde.");
    },
  });
}
