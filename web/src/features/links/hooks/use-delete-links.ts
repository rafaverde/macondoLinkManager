import { api } from "@/lib/api";
import { invalidateLinksData } from "@/features/shared/cache/query-invalidation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDeleteLink() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/links/${id}`);
    },
    onSuccess: () => {
      toast.success("Link removido com sucesso!");
      void invalidateLinksData(queryClient);
    },
    onError: () => {
      toast.error("Erro ao remover o link. Tente novamente mais tarde.");
    },
  });
}
