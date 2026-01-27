import { api } from "@/lib/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
}
