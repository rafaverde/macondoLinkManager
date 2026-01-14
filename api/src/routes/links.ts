import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { authHook } from "../hooks/auth";
import { PrismaLinksRepository } from "../repositories/prisma/prisma-links-repository";
import { PrismaClientsRepository } from "../repositories/prisma/prisma-clients-repository";
import { LinksService } from "../services/links-service";
import { LinkNotFoundError } from "../services/errors/link-not-found-error";
import { PrismaClicksRepository } from "../repositories/prisma/prisma-clicks-repository";
import { ClientNotFoundError } from "../services/errors/client-not-found-error";
import { requireLinkOwner } from "../middlewares/require-link-owner";

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

const metricsSchema = z.object({
  clicksByDate: z.array(
    z.object({
      date: z.string(),
      count: z.number(),
    })
  ),
  topBrowsers: z.array(
    z.object({
      browser: z.string(),
      count: z.number(),
    })
  ),
  topLocations: z.array(
    z.object({
      ip: z.string(),
      count: z.number(),
    })
  ),
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
          search: z.string().optional(),
        }),
        response: {
          200: z.array(linkSchema),
        },
      },
    },
    async (request, reply) => {
      const { clientId, campaignId, search } = request.query;
      const userId = request.user.sub; // Filtra pelo usuário logado

      const linksRepo = new PrismaLinksRepository();
      const clientsRepo = new PrismaClientsRepository();
      const clicksRepo = new PrismaClicksRepository();
      const service = new LinksService(linksRepo, clientsRepo, clicksRepo);

      const links = await service.listLinks({
        userId,
        clientId,
        campaignId,
        search,
      });

      return reply.status(200).send(links);
    }
  );

  // Rota GET mostra link por id
  app.withTypeProvider<ZodTypeProvider>().get(
    "/links/:id",
    {
      onRequest: [authHook, requireLinkOwner],
      schema: {
        tags: ["Links"],
        summary: "Obtém detalhes de um link.",
        params: z.object({ id: z.uuid() }),
        response: {
          200: linkSchema,
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const linksRepo = new PrismaLinksRepository();
      const clientsRepo = new PrismaClientsRepository();
      const clicksRepo = new PrismaClicksRepository();
      const service = new LinksService(linksRepo, clientsRepo, clicksRepo);

      try {
        const link = await service.getLink(id);
        return reply.send(link);
      } catch (err) {
        if (err instanceof LinkNotFoundError) {
          return reply.status(404).send({ message: err.message });
        }
        throw err;
      }
    }
  );

  // Rota PUT faz update do link
  app.withTypeProvider<ZodTypeProvider>().put(
    "/links/:id",
    {
      onRequest: [authHook, requireLinkOwner],
      schema: {
        tags: ["Links"],
        summary: "Atualiza informações de um link.",
        params: z.object({
          id: z.uuid(),
        }),
        body: z.object({
          originalUrl: z.url().optional(),
          clientId: z.uuid().optional(),
          campaignId: z.uuid().optional().nullable(),
        }),
        response: {
          200: linkSchema,
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { originalUrl, clientId, campaignId } = request.body;

      const linksRepo = new PrismaLinksRepository();
      const clientsRepo = new PrismaClientsRepository();
      const clicksRepo = new PrismaClicksRepository();
      const service = new LinksService(linksRepo, clientsRepo, clicksRepo);

      try {
        const updatedLink = await service.updateLink(id, {
          originalUrl,
          clientId,
          campaignId,
        });

        return reply.status(200).send(updatedLink);
      } catch (err) {
        if (err instanceof ClientNotFoundError) {
          return reply.status(404).send({ message: err.message });
        }
        throw err;
      }
    }
  );

  // Rota DELETE apaga um link
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/links/:id",
    {
      onRequest: [authHook, requireLinkOwner],
      schema: {
        tags: ["Links"],
        summary: "Deleta um link.",
        params: z.object({ id: z.uuid() }),
        response: {
          204: z.null(),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const linksRepo = new PrismaLinksRepository();
      const clientsRepo = new PrismaClientsRepository();
      const clicksRepo = new PrismaClicksRepository();
      const service = new LinksService(linksRepo, clientsRepo, clicksRepo);

      try {
        await service.deleteLink(id);
        return reply.status(204).send();
      } catch (err) {
        if (err instanceof LinkNotFoundError)
          return reply.status(404).send({ message: err.message });
        throw err;
      }
    }
  );

  // Rota GET Metrics
  app.withTypeProvider<ZodTypeProvider>().get(
    "/links/:id/metrics",
    {
      onRequest: [authHook, requireLinkOwner],
      schema: {
        tags: ["Analytics"],
        summary: "Obtém estatísticas de acesso do link.",
        params: z.object({
          id: z.uuid(),
        }),
        querystring: z.object({
          days: z.coerce.number().min(1).max(365).optional().default(30),
        }),
        response: {
          200: metricsSchema,
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { days } = request.query;

      const linksRepo = new PrismaLinksRepository();
      const clientsRepo = new PrismaClientsRepository();
      const clicksRepo = new PrismaClicksRepository();
      const service = new LinksService(linksRepo, clientsRepo, clicksRepo);

      try {
        const metrics = await service.getLinkMetrics(id, days);
        return reply.status(200).send(metrics);
      } catch (err) {
        if (err instanceof LinkNotFoundError) {
          return reply.status(404).send({ message: err.message });
        }
        throw err;
      }
    }
  );
}
