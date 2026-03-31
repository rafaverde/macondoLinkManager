import Fastify, { FastifyBaseLogger, FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import fastifyCookie from "@fastify/cookie";
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
import { AppServices, appServicesPlugin } from "./plugins/app-services";

interface BuildAppOptions {
  services?: AppServices;
  healthcheck?: () => Promise<unknown>;
  logger?: FastifyBaseLogger | boolean | Record<string, unknown>;
}

export async function buildApp(options: BuildAppOptions = {}) {
  const app = Fastify({
    logger: options.logger ?? {
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
    },
    trustProxy: true,
  }).withTypeProvider<ZodTypeProvider>();

  app.addHook("onRequest", async (request, reply) => {
    reply.header("x-request-id", request.id);
  });

  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(cors, {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: "Macondo Link Manager API",
        description: "API para o gerenciador de links da Macondo Propaganda.",
        version: "1.0.3",
      },
      servers: [{ url: process.env.BASE_URL || `http://localhost:${env.PORT}` }],
    },
    transform: jsonSchemaTransform,
  });

  app.register(swaggerUi, {
    routePrefix: "/docs",
    staticCSP: true,
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
  });

  await app.register(fastifyCookie);

  await app.register(jwt, {
    secret: env.JWT_SECRET,
    cookie: {
      cookieName: "macondo.token",
      signed: false,
    },
  });

  app.setErrorHandler(errorHandler);
  await app.register(appServicesPlugin, { services: options.services });

  await app.register(authRoutes);
  await app.register(usersRoutes);
  await app.register(clientsRoutes);
  await app.register(campaignsRoutes);
  await app.register(linksRoutes);
  await app.register(redirectRoutes);
  await app.register(dashboardRoutes);

  const runHealthcheck =
    options.healthcheck ??
    (async () => {
      const { prisma } = await import("./lib/prisma");
      return prisma.$queryRaw`SELECT 1`;
    });

  await app.register(async (healthApp: FastifyInstance) => {
    healthApp.get("/health", async (request, reply) => {
      try {
        await runHealthcheck();
        request.log.info("Health check OK");

        return reply.status(200).send({ status: "ok", dbConnection: "healthy" });
      } catch (error) {
        request.log.error({ err: error }, "Database health check failed");
        return reply
          .status(503)
          .send({ status: "error", dbConnection: "unhealthy" });
      }
    });
  });

  return app;
}
