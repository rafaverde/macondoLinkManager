import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Cria as iniciais par o fallback do avatar
export function createInitials(name: string | undefined) {
  const clientName = name || "U2";
  const clientInitials = clientName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return clientInitials;
}

// Formata a data para padrão pt-BR
export function formatDate(date: string) {
  const formattedDate = new Date(date).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return formattedDate;
}

// Formata link tirando protocolo da exibição
export function formatLink(link: string | undefined) {
  const formattedLink = `${process.env.NEXT_PUBLIC_API_URL?.replace(/^https?:\/\//, "")}/${link}`;
  return formattedLink;
}
