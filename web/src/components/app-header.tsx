"use client";

import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { SidebarTrigger } from "./ui/sidebar";

export default function AppHeader() {
  const router = useRouter();

  const { data: user } = useUser();

  function handleLogout() {
    document.cookie =
      "macondo.token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    router.push("/");
  }

  const initials = user?.name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="bg-background shadow-b-sm sticky top-0 z-10 flex h-16 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
      </div>
    </header>
  );
}
