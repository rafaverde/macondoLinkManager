import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { authHook } from "../hooks/auth";
import { PrismaLinksRepository } from "../repositories/prisma/prisma-links-repository";
import { PrismaClientsRepository } from "../repositories/prisma/prisma-clients-repository";
import { LinksService, NotAllowedError } from "../services/links-service";
import { LinkNotFoundError } from "../services/errors/link-not-found-error";
import { PrismaClicksRepository } from "../repositories/prisma/prisma-clicks-repository";
import { ClientNotFoundError } from "../services/errors/client-not-found-error copy";

const linkSchema = z.object({
  id: z.uuid(),
  originalUrl: z.url(),
  shortCode: z.string(),
  userId: z.uuid(),
  clientId: z.uuid(),
  campaignId: z.uuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  // Campos relacionamentos
  client: z.object({ name: z.string() }).optional(),
  campaign: z.object({ name: z.string() }).nullable().optional(),
  _count: z.object({ clicks: z.number() }).optional(),
});

export async function linksRoutes(app: FastifyInstance) {
  // Rota POST cria link
  app.withTypeProvider<ZodTypeProvider>().post(
    "/links",
    {
      onRequest: [authHook], // Protegida
      schema: {
        tags: ["Links"],
        summary: "Cria um novo link encurtado.",
        body: z.object({
          originalUrl: z.url(),
          clientId: z.uuid(),
          campaignId: z.uuid().nullish(),
          tags: z.array(z.string()).optional(),
        }),
        response: {
          201: linkSchema,
          404: z.object({ message: z.string() }), // Erro cliente não encontrado
        },
      },
    },
    async (request, reply) => {
      const { originalUrl, clientId, campaignId, tags } = request.body;
      const userId = request.user.sub; // Pega o id do user logado no token

      // Instanciando dependências
      const linkRepo = new PrismaLinksRepository();
      const clientsRepo = new PrismaClientsRepository();
      const clicksRepo = new PrismaClicksRepository();
      const service = new LinksService(linkRepo, clientsRepo, clicksRepo);

      try {
        const link = await service.createLink({
          originalUrl,
          userId,
          clientId,
          campaignId,
          tags,
        });

        return reply.status(201).send(link);
      } catch (err) {
        if (err instanceof ClientNotFoundError) {
          return reply.status(404).send({ message: err.message });
        }
        throw err;
      }
    }
  );

  // Rota GET mostra todos os links
  app.withTypeProvider<ZodTypeProvider>().get(
    "/links",
    {
      onRequest: [authHook], // Protegida
      schema: {
        tags: ["Links"],
        summary: "Lista os links do usuário logado.",
        querystring: z.object({
          // Filtros opcionais na URL
          clientId: z.uuid().optional(),
          campaignId: z.uuid().optional(),
        }),
        response: {
          200: z.array(linkSchema),
        },
      },
    },
    async (request, reply) => {
      const { clientId, campaignId } = request.query;
      const userId = request.user.sub; // Filtra pelo usuário logado

      const linksRepo = new PrismaLinksRepository();
      const clientsRepo = new PrismaClientsRepository();
      const clicksRepo = new PrismaClicksRepository();
      const service = new LinksService(linksRepo, clientsRepo, clicksRepo);

      const links = await service.listLinks({
        userId,
        clientId,
        campaignId,
      });

      return reply.status(200).send(links);
    }
  );

  // Rota GET mostra link por id
  app.withTypeProvider<ZodTypeProvider>().get(
    "/links/:id",
    {
      onRequest: [authHook],
      schema: {
        tags: ["Links"],
        summary: "Obtém detalhes de um link.",
        params: z.object({ id: z.uuid() }),
        response: {
          200: linkSchema,
          403: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const userId = request.user.sub;

      const linksRepo = new PrismaLinksRepository();
      const clientsRepo = new PrismaClientsRepository();
      const clicksRepo = new PrismaClicksRepository();
      const service = new LinksService(linksRepo, clientsRepo, clicksRepo);

      try {
        const link = await service.getLink(id, userId);
        if (!link)
          return reply.status(404).send({ message: "Link não encontrado." });
        return reply.send(link);
      } catch (err) {
        if (err instanceof NotAllowedError)
          return reply.status(403).send({ message: err.message });
        throw err;
      }
    }
  );

  // Rota DELETE apaga um link
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/links/:id",
    {
      onRequest: [authHook],
      schema: {
        tags: ["Links"],
        summary: "Deleta um link.",
        params: z.object({ id: z.uuid() }),
        response: {
          204: z.null(),
          403: z.object({ message: z.string() }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const userId = request.user.sub;

      const linksRepo = new PrismaLinksRepository();
      const clientsRepo = new PrismaClientsRepository();
      const clicksRepo = new PrismaClicksRepository();
      const service = new LinksService(linksRepo, clientsRepo, clicksRepo);

      try {
        await service.deleteLink(id, userId);
        return reply.status(204).send();
      } catch (err) {
        if (err instanceof NotAllowedError)
          return reply.status(403).send({ message: err.message });
        if (err instanceof LinkNotFoundError)
          return reply.status(404).send({ message: err.message });
        throw err;
      }
    }
  );
}
