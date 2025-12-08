import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { authHook } from "../hooks/auth";
import { PrismaCampaignsRepository } from "../repositories/prisma/prisma-campaign-repository";
import { PrismaClientsRepository } from "../repositories/prisma/prisma-clients-repository";
import { CampaignsService } from "../services/campaigns-service";
import { LinkNotFoundError } from "../services/errors/link-not-found-error";
import { CampaignAlreadyExistsError } from "../services/errors/campaign-already-exists-error";

const campaignSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  clientId: z.uuid(),
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
        response: {
          200: z.array(campaignSchema), // Retorna um array de campanhas
        },
      },
    },
    async (request, reply) => {
      const campaignsRepo = new PrismaCampaignsRepository();
      const clientsRepo = new PrismaClientsRepository();
      const service = new CampaignsService(campaignsRepo, clientsRepo);

      const campaigns = await service.listCampaigns();
      return reply.status(200).send(campaigns);
    }
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
        if (err instanceof LinkNotFoundError) {
          return reply.status(404).send({ message: err.message });
        }
        if (err instanceof CampaignAlreadyExistsError) {
          return reply.status(409).send({ message: err.message });
        }

        throw err; // Fastify lida com outros erros
      }
    }
  );
}
