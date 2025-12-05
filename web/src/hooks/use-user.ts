import { api } from "@/lib/api";
import { User } from "@/types";
import { useQuery } from "@tanstack/react-query";

export function useUser() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await api.get<{ user: User }>("/me");
      return data.user;
    },
    staleTime: Infinity,
    retry: false,
  });
}
