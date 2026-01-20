"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/lib/api";
import FullscreenLoader from "@/components/fullscreen-loader";

export default function AuthCallbackClient() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = params.get("token");
    const error = params.get("error");

    if (error) {
      router.replace(`/?error=${error}`);
      return;
    }

    if (!token) {
      router.replace("/?error=INVALID_CALLBACK");
      return;
    }

    async function finalizeAuth() {
      try {
        await api.post("/auth/session", { token }, { withCredentials: true });

        router.replace("/dashboard");
      } catch {
        router.replace("/?error=SESSION_FAILED");
      }
    }

    finalizeAuth();
  }, [params, router]);

  return <FullscreenLoader label="Finalizando login..." />;
}
