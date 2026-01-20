"use client";

import { api } from "@/lib/api";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useUser } from "@/hooks/use-user";

import { Button } from "@/components/ui/button";

import macondoLogo from "@/assets/macondo-logo.svg";
import googleLogo from "@/assets/google-color.svg";
import { AuthFeedback } from "@/components/auth-feedback";
import FullscreenLoader from "@/components/fullscreen-loader";

export default function LoginPage() {
  // Busca usuário atual (/me)
  const { data: user, isLoading } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  function handleLogin() {
    window.location.href = `${api.defaults.baseURL}/auth/google`;
  }

  // Enquanto verifica o cookie, mostra um loading simples ou nada
  if (isLoading) {
    return <FullscreenLoader label="Iniciando aplicação..." />;
  }

  // Se já estiver redirecionando, não mostra o login para evitar "flicker"
  if (user) {
    return null;
  }

  return (
    <>
      <Suspense>
        <AuthFeedback />
      </Suspense>
      <div className="grid h-dvh w-full grid-rows-2 items-center md:grid-cols-2 md:grid-rows-none md:justify-center">
        <div className="flex flex-col items-center justify-center gap-4 p-24 md:p-10">
          <Image
            src={macondoLogo}
            alt="Macondo Propaganda Logo"
            className="w-50 md:w-70"
          />
          <p className="w-[70%] text-center text-sm">
            Bem-vindo à plataforma de Links da Macondo Propaganda.
          </p>
        </div>
        <div className="bg-secondary flex h-full w-full flex-col items-center justify-center gap-4 text-xs md:gap-8">
          <Button
            variant="outline"
            size="default"
            className="cursor-pointer rounded-4xl bg-transparent p-10"
            onClick={handleLogin}
          >
            <Image src={googleLogo} alt="" className="size-8" />
            <p className="font-light">Fazer login com Google</p>
          </Button>
          <p>
            É necessário fazer parte da equipe{" "}
            <strong className="text-primary">@macondopropaganda.com</strong>
          </p>
        </div>
      </div>
    </>
  );
}
