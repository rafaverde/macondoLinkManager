import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { authHook } from "../hooks/auth";
import { PrismaClicksRepository } from "../repositories/prisma/prisma-clicks-repository";
import { PrismaLinksRepository } from "../repositories/prisma/prisma-links-repository";
import { PrismaClientsRepository } from "../repositories/prisma/prisma-clients-repository";
import { DashboardService } from "../services/dashboard-service";
import { PrismaCampaignsRepository } from "../repositories/prisma/prisma-campaign-repository";
import { CampaignNotAllowedError } from "../services/errors/campaign-not-allowed-error";

// Schemas
const errorSchema = z.object({
  message: z.string(),
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
        country: z.string().nullable(),
        count: z.number(),
      }),
    ),
    topCities: z.array(
      z.object({
        city: z.string().nullable(),
        count: z.number(),
      }),
    ),
  }),
  meta: z.object({
    hasData: z.boolean(),
  }),
});

export async function dashboardRoutes(app: FastifyInstance) {
  // Rota GET Top 5 Clientes
  app.withTypeProvider<ZodTypeProvider>().get(
    "/dashboard/top-clients",
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
      const service = new DashboardService(
        new PrismaClicksRepository(),
        new PrismaLinksRepository(),
        new PrismaClientsRepository(),
        new PrismaCampaignsRepository(),
      );

      const topClients = await service.getTopClients();
      return reply.send(topClients);
    },
  );

  // Rota GET Overview
  app.withTypeProvider<ZodTypeProvider>().get(
    "/dashboard/overview",
    {
      onRequest: [authHook],
      schema: {
        tags: ["Analytics"],
        summary:
          "Obtém métricas agregadas dos links da organização autenticada (últimos 30 dias).",
        response: {
          200: analyticsOverviewSchema,
        },
      },
    },
    async (_request, reply) => {
      const service = new DashboardService(
        new PrismaClicksRepository(),
        new PrismaLinksRepository(),
        new PrismaClientsRepository(),
        new PrismaCampaignsRepository(),
      );

      const overview = await service.getOverview();
      return reply.send(overview);
    },
  );

  // Rota Clients Overview
  app.withTypeProvider<ZodTypeProvider>().get(
    "/dashboard/clients/:clientId/overview",
    {
      onRequest: [authHook],
      schema: {
        tags: ["Analytics"],
        summary: "Obtém o dashboard de um cliente.",
        params: z.object({
          clientId: z.uuid(),
        }),
        response: {
          200: analyticsOverviewSchema,
        },
      },
    },
    async (request, reply) => {
      const { clientId } = request.params;

      const service = new DashboardService(
        new PrismaClicksRepository(),
        new PrismaLinksRepository(),
        new PrismaClientsRepository(),
        new PrismaCampaignsRepository(),
      );

      const overview = await service.getClientOverview(clientId);
      return reply.send(overview);
    },
  );

  // Rota Campaigns Overview
  app.withTypeProvider<ZodTypeProvider>().get(
    "/dashboard/campaigns/:campaignId/overview",
    {
      onRequest: [authHook],
      schema: {
        tags: ["Analytics"],
        summary: "Obtém o dashboard de uma campanha.",
        params: z.object({
          campaignId: z.uuid(),
        }),
        response: {
          200: analyticsOverviewSchema,
          403: errorSchema,
        },
      },
    },
    async (request, reply) => {
      const { campaignId } = request.params;

      const service = new DashboardService(
        new PrismaClicksRepository(),
        new PrismaLinksRepository(),
        new PrismaClientsRepository(),
        new PrismaCampaignsRepository(),
      );

      try {
        const overview = await service.getCampaignOverview(campaignId);
        return reply.send(overview);
      } catch (err) {
        if (err instanceof CampaignNotAllowedError) {
          return reply.status(403).send({ message: err.message });
        }
        throw err;
      }
    },
  );
}
