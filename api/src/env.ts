import "dotenv/config";
import { z } from "zod";

// Define o schema das nossas variáveis de ambiente
const envSchema = z.object({
  DATABASE_URL: z.url(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  JWT_SECRET: z.string(),
  FRONTEND_URL: z.url(),
  BASE_URL: z.url().optional(),
  PORT: z.coerce.number().default(3333),
});

const _env = envSchema.safeParse(process.env);

if (_env.success === false) {
  console.error("❌ Variáveis de ambiente inválidas:", _env.error.format());
  throw new Error("Variáveis de ambiente inválidas.");
}

export const env = _env.data;
