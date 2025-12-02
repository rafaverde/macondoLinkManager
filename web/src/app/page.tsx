"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { api } from "@/lib/api";
import { RiGoogleFill } from "@remixicon/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

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
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="space-y-4 pb-8 text-center">
          {/* Placeholder para a Logo - Depois você põe a imagem real */}
          <div className="bg-macondo-red-500 mx-auto flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold text-white">
            M
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight">
              Plataforma de Links
            </CardTitle>
            <CardDescription className="text-base">
              Gerencie suas campanhas e encurtamentos em um só lugar.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <Button
            size="lg"
            className="w-full gap-2 text-base font-semibold"
            onClick={handleLogin}
          >
            <RiGoogleFill size={20} />
            Fazer login com Google
          </Button>

          <p className="text-muted-foreground px-4 text-center text-xs">
            É necessário fazer parte da equipe <br />
            <span className="text-foreground font-medium">
              @macondopropaganda.com
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
