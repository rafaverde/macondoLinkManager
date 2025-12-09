import { api } from "@/lib/api";
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
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      if (onSuccessCallback) {
        onSuccessCallback(data.id);
      }
    },
    onError: () =>
      toast.error("Erro ao criar cliente. Tente novamente mais tarde."),
  });
}
