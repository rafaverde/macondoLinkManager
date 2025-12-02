"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";

export function TanstackProvider({ children }: { children: ReactNode }) {
  // Criamos o cliente dentro de um estado para garantir que ele seja único por requisição no servidor e único por sessão no cliente.
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Desativa recarregamento de dados quando troca de aba.
            refetchOnWindowFocus: false,
            retry: 1, // Diminui tentativas para 1 ao invés de 3 para agilizar debug.
            staleTime: 1000 * 60 * 5, // Cache time de 5 minutos
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
