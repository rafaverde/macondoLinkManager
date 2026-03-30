import { api } from "@/lib/api";
import {
  invalidateCampaignsData,
  invalidateDashboardData,
} from "@/lib/query-invalidation";
import { queryKeys } from "@/lib/query-keys";
import { CampaignListItem } from "@/types/campaigns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CreateCampaignArgs {
  name: string;
  clientId: string;
}

export function useCreateCampaign(onSuccessCallback?: (newId: string) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCampaignArgs) => {
      const response = await api.post("/campaigns", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(`Campanha ${data.name} criada com sucesso!`);

      queryClient.setQueryData<CampaignListItem[]>(
        queryKeys.campaigns.list(data.clientId),
        (old = []) => [...old, data],
      );
      void invalidateCampaignsData(queryClient, data.clientId);
      void invalidateDashboardData(queryClient, { clientId: data.clientId });

      if (onSuccessCallback) {
        setTimeout(() => onSuccessCallback(data.id), 10);
      }
    },
    onError: () =>
      toast.error("Erro ao criar campanha. Tente novamente mais tarde."),
  });
}
