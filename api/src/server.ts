import Fastify from "fastify";
import fastifyCookie from "@fastify/cookie";
import { prisma } from "./lib/prisma"; // Importamos nossa instância do Prisma
import { env } from "./env";
import jwt from "@fastify/jwt";
import { authRoutes } from "./routes/auth";
import { usersRoutes } from "./routes/users";

// Inicializa o Fastify
const app = Fastify({
  logger: true, // Habilita o logger do Fastify (ótimo para dev)
});

// Criação da Rota "Health Check"
// Esta rota é essencial para sabermos se a API está online
// e se consegue acessar o banco de dados.

// Função para Iniciar o Servidor
const start = async () => {
  try {
    // Regista os plugins globais
    await app.register(jwt, {
      secret: env.JWT_SECRET,
      cookie: {
        cookieName: "macondo.token",
        signed: false,
      },
    });

    await app.register(fastifyCookie);

    await app.register(authRoutes);
    await app.register(usersRoutes);

    await app.register(async (app) => {
      app.get("/health", async (request, reply) => {
        try {
          await prisma.$queryRaw`SELECT 1`;
          return reply
            .status(200)
            .send({ status: "ok", dbConnection: "healthy" });
        } catch (error) {
          console.error("Falha na conexão com o banco:", error);
          return reply
            .status(503)
            .send({ status: "error", dbConnection: "unhealthy" });
        }
      });
    });

    // O host '0.0.0.0' é crucial para o Docker
    // Significa "ouvir em todas as interfaces de rede" dentro do container
    await app.listen({ port: env.PORT, host: "0.0.0.0" });

    console.log(`🚀 Servidor rodando em http://localhost:${env.PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// Executa a função de início
start();
