import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { authHook } from "../hooks/auth";
import { PrismaCampaignsRepository } from "../repositories/prisma/prisma-campaign-repository";
import { PrismaClientsRepository } from "../repositories/prisma/prisma-clients-repository";
import { CampaignsService } from "../services/campaigns-service";
import { CampaignAlreadyExistsError } from "../services/errors/campaign-already-exists-error";
import { CampaignsListRepository } from "../repositories/read-models/campaigns-list-repository";
import { CampaignsListService } from "../services/campaings-list-service";

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

      const listSservice = new CampaignsListService(
        new CampaignsListRepository(),
      );

      const campaigns = await listSservice.execute(clientId);
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
          404: z.object({ message: z.string() }), // Cliente não encontrado
          409: z.object({ message: z.string() }), // Conflito, campanha já existe no cliente
        },
      },
    },
    async (request, reply) => {
      const { clientId, name } = request.body;

      const campaignsRepo = new PrismaCampaignsRepository();
      const clientsRepo = new PrismaClientsRepository();
      const service = new CampaignsService(campaignsRepo, clientsRepo);

      try {
        const campaign = await service.createCampaign({ name, clientId });
        return reply.status(201).send(campaign);
      } catch (err) {
        // Lida com nossos erros customizados
        if (err instanceof CampaignAlreadyExistsError) {
          return reply.status(409).send({ message: err.message });
        }

        throw err; // Fastify lida com outros erros
      }
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
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const service = new CampaignsService(
        new PrismaCampaignsRepository(),
        new PrismaClientsRepository(),
      );

      const campaign = await service.getCampaignById(id);
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
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const service = new CampaignsService(
        new PrismaCampaignsRepository(),
        new PrismaClientsRepository(),
      );

      await service.deleteCampaign(id);
      return reply.status(204).send();
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
          404: z.object({ message: z.string() }),
          409: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { name } = request.body;

      const service = new CampaignsService(
        new PrismaCampaignsRepository(),
        new PrismaClientsRepository(),
      );

      try {
        const campaign = await service.updateCampaign(id, name);
        return reply.status(200).send(campaign);
      } catch (err) {
        if (err instanceof CampaignAlreadyExistsError) {
          return reply.status(409).send({ message: err.message });
        }
        throw err;
      }
    },
  );
}
