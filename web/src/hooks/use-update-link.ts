import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

// DTO para atualização parcial
interface UpdateLinkData {
  id: string;
  name?: string;
  originalUrl?: string;
  clientId?: string;
  campaignId?: string | null;
  tags?: string[];
}

export function useUpdateLink(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateLinkData) => {
      const { id, ...body } = data;
      const response = await api.put(`/links/${id}`, body);
      return response.data;
    },
    onSuccess: (data, variables) => {
      toast.success("Link atualizado com sucesso");

      queryClient.invalidateQueries({ queryKey: ["links"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });

      queryClient.setQueryData(["link", variables.id], data);

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

      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Erro ao atualizar link.";
      toast.error(message);
    },
  });
}
