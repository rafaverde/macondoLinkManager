"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { toast } from "sonner";

export function AuthFeedback() {
  const params = useSearchParams();
  const router = useRouter();
  const hasHandled = useRef(false);

  useEffect(() => {
    if (hasHandled.current) return;

    const error = params.get("error");

    // Necessita rever estratégia, pois não está disparando o toast no fluxo de renderização de autenticação.
    if (error === "DOMAIN_NOT_ALLOWED") {
      hasHandled.current = true;

      toast.error("Seu email não tem permissão para acessar essa organização.");

      // limpa a URL sem desmontar o layout
      router.replace("/", { scroll: false });
    }
  }, [params, router]);

  return null;
}
