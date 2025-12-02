"use client";

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

import macondoLogo from "@/assets/macondo-logo.svg";
import googleLogo from "@/assets/google-color.svg";

export default function LoginPage() {
  const router = useRouter();

  // Busca usuário atual (/me)
  const { data: user, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      // Se houver erro 401, o axios lança exceção e cai no isError
      const response = await api.get("/me");
      return response.data?.user;
    },
    retry: false,
  });

  // Se o usuário existe e faz login, redireciona para o Dashboard
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  function handleLogin() {
    window.location.href = `${api.defaults.baseURL}/auth/google`;
  }

  // Enquanto verifica o cookie, mostra um loading simples ou nada
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Carregando...
      </div>
    );
  }

  // Se já estiver redirecionando, não mostra o login para evitar "flicker"
  if (user) {
    return null;
  }

  return (
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
  );
}
