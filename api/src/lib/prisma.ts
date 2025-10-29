// Importa o cliente do Prisma
import { PrismaClient } from "@prisma/client";

// Instancia o cliente e exporta
// O 'log' nos ajuda a ver as queries no terminal durante o desenvolvimento
export const prisma = new PrismaClient({
  log: ["query", "info", "warn", "error"],
});
