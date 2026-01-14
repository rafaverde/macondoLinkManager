import Fastify from "fastify";
import cors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
import { prisma } from "./lib/prisma"; // Importamos nossa instância do Prisma
import { env } from "./env";
import jwt from "@fastify/jwt";
import { authRoutes } from "./routes/auth";
import { usersRoutes } from "./routes/users";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import {
  ZodTypeProvider,
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
} from "fastify-type-provider-zod";
import { clientsRoutes } from "./routes/clients";
import { campaignsRoutes } from "./routes/campaigns";
import { linksRoutes } from "./routes/links";
import { redirectRoutes } from "./routes/redirect";
import { dashboardRoutes } from "./routes/dashboard";
import { errorHandler } from "./errors/error-handler";

// Inicializa o Fastify
const app = Fastify({
  logger: true, // Habilita o logger do Fastify (ótimo para dev)
}).withTypeProvider<ZodTypeProvider>(); // "Ensina" o Fastify a entender os tipos do Zod.

// Configura compiladores do Zod
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

// Função para Iniciar o Servidor
const start = async () => {
  try {
    // Registra CORS
    await app.register(cors, {
      // Limita acesso pelo front-end
      origin: [env.FRONTEND_URL, "http:/localhost:3000"],
      // Permite que cookies sejam enviados/recebidos
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    });
    // Registra o Swagger
    await app.register(swagger, {
      openapi: {
        info: {
          title: "Macondo Link Manager API",
          description: "API para o gerenciador de links da Macondo Propaganda.",
          version: "1.0.0",
        },
        servers: [{ url: `http://localhost:${env.PORT}` }],
      },
      transform: jsonSchemaTransform,
    });

    // Registra o Swagger UI (Interface)
    app.register(swaggerUi, {
      routePrefix: "/docs",
      staticCSP: true,
      uiConfig: {
        docExpansion: "list",
        deepLinking: true,
      },
    });

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
    await app.register(clientsRoutes);
    await app.register(campaignsRoutes);
    await app.register(linksRoutes);
    await app.register(redirectRoutes);
    await app.register(dashboardRoutes);

    app.setErrorHandler(errorHandler);

    // Criação da Rota "Health Check"
    // Esta rota é essencial para sabermos se a API está online
    // e se consegue acessar o banco de dados
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
