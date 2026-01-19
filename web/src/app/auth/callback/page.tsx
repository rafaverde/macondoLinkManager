"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

export default function AuthCallbackPage() {
  const params = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      router.replace("/");
      return;
    }

    api
      .post("/auth/session", { token }, { withCredentials: true })
      .then(() => {
        router.replace("/dashboard");
      })
      .catch(() => {
        router.replace("/?error=AUTH_FAILED");
      });
  }, [params, router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Autenticando…</p>
    </div>
  );
}
