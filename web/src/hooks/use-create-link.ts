import { api } from "@/lib/api";
import { invalidateLinksData } from "@/lib/query-invalidation";
import { CreateLinkData } from "@/types";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ApiErrorResponse {
  message?: string;
}

export function useCreateLink(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateLinkData) => {
      const response = await api.post("/links", data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      toast.success("Link criado com sucesso.");
      void invalidateLinksData(queryClient, {
        clientId: variables.clientId,
        campaignId: variables.campaignId,
      });

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    },
    onError: (error: AxiosError<ApiErrorResponse>) => {
      const message =
        error.response?.data?.message || "Erro ao criar o link.";
      toast.error(message);
    },
  });
}
