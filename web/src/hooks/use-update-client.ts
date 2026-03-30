import { api } from "@/lib/api";
import {
  invalidateClientsData,
  invalidateDashboardData,
} from "@/lib/query-invalidation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface UpdateClientData {
  id: string;
  name: string;
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, name }: UpdateClientData) => {
      const { data } = await api.put(`/clients/${id}`, { name });
      return data;
    },
    onSuccess: () => {
      toast.success("Cliente alterado com sucesso!");
      void invalidateClientsData(queryClient);
      void invalidateDashboardData(queryClient);
    },
    onError: () => {
      toast.error(
        "Erro ao atualizar dados do cliente. Tente novamente mais tarde.",
      );
    },
  });
}
