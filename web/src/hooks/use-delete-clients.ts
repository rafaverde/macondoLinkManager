import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientId: string) => {
      await api.delete(`/clients/${clientId}`);
    },
    onSuccess: () => {
      toast.warning("Cliente e seus dados relacionados apagados!");
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: () => {
      toast.error("Erro ao apagar cliente. Tente novamente mais tarde.");
    },
  });
}
