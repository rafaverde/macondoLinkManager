import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { authHook } from "../hooks/auth";
import { analyticsOverviewSchema, topClientsSchema } from "../interfaces/http/schemas/analytics-schemas";
import { messageResponseSchema } from "../interfaces/http/schemas/common-schemas";

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
      const topClients = await app.services.dashboardService.getTopClients();
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
      const overview = await app.services.dashboardService.getOverview();
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
      const overview =
        await app.services.dashboardService.getClientOverview(clientId);
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
          404: messageResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { campaignId } = request.params;
      const overview =
        await app.services.dashboardService.getCampaignOverview(campaignId);
      return reply.send(overview);
    },
  );
}
