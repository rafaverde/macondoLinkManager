import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { authHook } from "../hooks/auth";
import { messageResponseSchema } from "../interfaces/http/schemas/common-schemas";

const campaignSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  clientId: z.uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const campaingsListSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  clientId: z.uuid(),
  clientName: z.string(),
  linksCount: z.number().int().nonnegative(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export async function campaignsRoutes(app: FastifyInstance) {
  // Rota GET /campaigns
  app.withTypeProvider<ZodTypeProvider>().get(
    "/campaigns",
    {
      onRequest: [authHook], // Protegida!
      schema: {
        tags: ["Management"],
        summary: "Lista todas as campanhas.",
        querystring: z.object({
          clientId: z.uuid().optional(),
        }),
        response: {
          200: z.array(campaingsListSchema), // Retorna um array de campanhas
        },
      },
    },
    async (request, reply) => {
      const { clientId } = request.query;
      const campaigns = await app.services.campaignsListService.execute(
        clientId,
      );
      return reply.status(200).send(campaigns);
    },
  );

  // Rota POST /campaigns
  app.withTypeProvider<ZodTypeProvider>().post(
    "/campaigns",
    {
      onRequest: [authHook], // Proteção
      schema: {
        tags: ["Management"],
        summary: "Cria uma nova campanha.",
        body: z.object({
          name: z.string().min(3),
          clientId: z.uuid(), // Exigimos o clientId no body para criar
        }),
        response: {
          201: campaignSchema, // Sucesso
          404: messageResponseSchema,
          409: messageResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { clientId, name } = request.body;
      const campaign = await app.services.campaignsService.createCampaign({
        name,
        clientId,
      });
      return reply.status(201).send(campaign);
    },
  );

  // Rota GET campaign by id
  app.withTypeProvider<ZodTypeProvider>().get(
    "/campaigns/:id",
    {
      onRequest: [authHook],
      schema: {
        tags: ["Management"],
        summary: "Obtém uma campanha pelo id",
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: campaignSchema,
          404: messageResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const campaign = await app.services.campaignsService.getCampaignById(id);
      return reply.send(campaign);
    },
  );

  // Rota DELETE campaign by id
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/campaigns/:id",
    {
      onRequest: [authHook],
      schema: {
        tags: ["Management"],
        summary:
          "Exclui uma campanha e desassocia os links pertencentes a ela.",
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          204: z.null(),
          404: messageResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      await app.services.campaignsService.deleteCampaign(id);
      return reply.status(204).send(null);
    },
  );

  // Rota PUT campaigns by id
  app.withTypeProvider<ZodTypeProvider>().put(
    "/campaigns/:id",
    {
      onRequest: [authHook],
      schema: {
        tags: ["Management"],
        summary: "Atualiza os dados de uma campanha.",
        params: z.object({
          id: z.uuid(),
        }),
        body: z.object({
          name: z.string().min(3),
        }),
        response: {
          200: campaignSchema,
          404: messageResponseSchema,
          409: messageResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { name } = request.body;
      const campaign = await app.services.campaignsService.updateCampaign(
        id,
        name,
      );
      return reply.status(200).send(campaign);
    },
  );
}
