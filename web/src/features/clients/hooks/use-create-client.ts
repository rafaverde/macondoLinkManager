import { api } from "@/lib/api";
import {
  invalidateClientsData,
  invalidateDashboardData,
} from "@/features/shared/cache/query-invalidation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useCreateClient(onSuccessCallback?: (newId: string) => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string) => {
      const response = await api.post("/clients", { name });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(`Cliente ${data.name} criado!`);
      void invalidateClientsData(queryClient);
      void invalidateDashboardData(queryClient);

      if (onSuccessCallback) {
        setTimeout(() => onSuccessCallback(data.id), 10);
      }
    },
    onError: () =>
      toast.error("Erro ao criar cliente. Tente novamente mais tarde."),
  });
}
