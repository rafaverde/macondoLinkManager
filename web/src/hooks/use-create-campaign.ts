import { api } from "@/lib/api";
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

      queryClient.setQueryData<CampaignListItem[]>(["campaigns"], (old = []) => [
        ...old,
        data,
      ]);
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });

      if (onSuccessCallback) {
        setTimeout(() => onSuccessCallback(data.id), 10);
      }
    },
    onError: () =>
      toast.error("Erro ao criar campanha. Tente novamente mais tarde."),
  });
}
