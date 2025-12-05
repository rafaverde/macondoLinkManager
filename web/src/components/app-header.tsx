"use client";

import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { SidebarTrigger } from "./ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { RiLogoutBoxLine } from "@remixicon/react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export default function AppHeader() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: user } = useUser();
  console.log(user);

  async function handleLogout() {
    try {
      // Chama api para invalidar o cookie no navegador
      await api.post("/auth/logout");
      // Limpa cache do ReactQuery
      queryClient.clear();
      // Redireciona para o login
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout", error);
      // Mesmo com erro, força o redirecionamento por segurança
      router.push("/");
    }
  }

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="bg-background shadow-b-sm sticky top-0 z-10 flex h-20 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:block">
          <div className="text-muted-foreground text-right leading-tight">
            <p className="text-sm font-bold">{user?.name}</p>
            <p className="text-xs">{user?.email}</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:ring-ring cursor-pointer rounded-full ring-offset-2 outline-none focus:ring-1">
            <Avatar className="size-10 hover:brightness-80">
              <AvatarImage src={user?.avatarUrl || ""} alt={user?.name} />
              <AvatarFallback className="bg-primary font-bold text-white">
                {initials || "U2"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-foreground hover:text-destructive focus:text-destructive cursor-pointer gap-2"
            >
              <RiLogoutBoxLine className="hover:text-destructive size-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
