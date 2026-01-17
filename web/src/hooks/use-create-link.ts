import { api } from "@/lib/api";
import { CreateLinkData } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateLink(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLinkData) => {
      const response = await api.post("/links", data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      toast.success("Link criado com sucesso.");

      // Força o React Query a buscar a lista de links atualizada.
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

      // Executa função extra
      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: any) => {
      // Tenta pegar a mensagem de erro da API ou usa uma genérica
      const message = error.response?.data.message || "Erro ao criar o link.";
      toast.error(message);
    },
  });
}
