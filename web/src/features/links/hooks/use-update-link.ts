import { api } from "@/lib/api";
import { invalidateLinksData } from "@/features/shared/cache/query-invalidation";
import { queryKeys } from "@/features/shared/cache/query-keys";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ApiErrorResponse {
  message?: string;
}

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
      queryClient.setQueryData(queryKeys.links.detail(variables.id), data);
      void invalidateLinksData(queryClient, {
        clientId: variables.clientId,
        campaignId: variables.campaignId,
        linkId: variables.id,
      });

      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.message || "Erro ao atualizar link.";
      toast.error(message);
    },
  });
}
