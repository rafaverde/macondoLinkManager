import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { error } from "console";
import { toast } from "sonner";

// DTO para atualização parcial
interface UpdateLinkData {
  id: string;
  originalUrl?: string;
  clientId?: string;
  campaignId?: string | null;
}

export function useUpdateLink(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateLinkData) => {
      const { id, ...body } = data;
      const response = await api.put(`/links/${id}`, body);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Link atualizado com sucesso");
      queryClient.invalidateQueries({ queryKey: ["links"] });
      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || "Erro ao atualizar link.";
      toast.error(message);
    },
  });
}
