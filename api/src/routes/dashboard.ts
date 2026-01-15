import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { authHook } from "../hooks/auth";
import { PrismaClicksRepository } from "../repositories/prisma/prisma-clicks-repository";
import { PrismaLinksRepository } from "../repositories/prisma/prisma-links-repository";
import { PrismaClientsRepository } from "../repositories/prisma/prisma-clients-repository";
import { DashboardService } from "../services/dashboard-service";

// Schemas
const generalMetricsSchema = z.object({
  totalClicks: z.number(),
  activeLinks: z.number(),
});

const topClientsSchema = z.array(
  z.object({
    name: z.string(),
    clicks: z.number(),
  }),
);

const analyticsOverviewSchema = z.object({
  summary: z.object({
    totalClicks: z.number(),
    activeLinks: z.number(),
    period: z.string(),
  }),
  charts: z.object({
    clicksByDate: z.array(
      z.object({
        date: z.string(),
        count: z.number(),
      }),
    ),
    topBrowsers: z.array(
      z.object({
        browser: z.string(),
        count: z.number(),
      }),
    ),
    topCountries: z.array(
      z.object({
        country: z.string(),
        count: z.number(),
      }),
    ),
    topCities: z.array(
      z.object({
        city: z.string(),
        count: z.number(),
      }),
    ),
  }),
  meta: z.object({
    hasData: z.boolean(),
  }),
});

export async function dashboardRoutes(app: FastifyInstance) {
  // Rota GET métricas gerais
  app.withTypeProvider<ZodTypeProvider>().get(
    "/metrics/general",
    {
      onRequest: [authHook],
      schema: {
        tags: ["Analytics"],
        summary: "Obtém as métricas gerais (Total cliques, LinksA Ativos)",
        response: {
          200: generalMetricsSchema,
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub;

      const clicksRepo = new PrismaClicksRepository();
      const linksRepo = new PrismaLinksRepository();
      const clientsRepo = new PrismaClientsRepository();
      const service = new DashboardService(clicksRepo, linksRepo, clientsRepo);

      const metrics = await service.getGeneralMetrics(userId);
      return reply.send(metrics);
    },
  );

  // Rota GET Top 5 Clientes
  app.withTypeProvider<ZodTypeProvider>().get(
    "/metrics/top-clients",
    {
      onRequest: [authHook],
      schema: {
        tags: ["Analytics"],
        summary: "Obtém o ranking dos top 5 clientes por cliques.",
        response: {
          200: topClientsSchema,
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub;

      const clicksRepo = new PrismaClicksRepository();
      const linksRepo = new PrismaLinksRepository();
      const clientsRepo = new PrismaClientsRepository();
      const service = new DashboardService(clicksRepo, linksRepo, clientsRepo);

      const topClients = await service.getTopClients(userId);
      return reply.send(topClients);
    },
  );

  // Rota GET Overview
  app.withTypeProvider<ZodTypeProvider>().get(
    "/metrics/overview",
    {
      onRequest: [authHook],
      schema: {
        tags: ["Analytics"],
        summary:
          "Obtém métricas agregadas de todos os links do usuários (últimos 30 dias)",
        response: {
          200: analyticsOverviewSchema,
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub;

      const service = new DashboardService(
        new PrismaClicksRepository(),
        new PrismaLinksRepository(),
        new PrismaClientsRepository(),
      );

      const overview = await service.getOverview(userId);
      return reply.send(overview);
    },
  );
}
