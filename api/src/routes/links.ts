import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { authHook } from "../hooks/auth";
import { PrismaLinksRepository } from "../repositories/prisma/prisma-links-repository";
import { PrismaClientsRepository } from "../repositories/prisma/prisma-clients-repository";
import { LinksService } from "../services/links-service";
import { PrismaClicksRepository } from "../repositories/prisma/prisma-clicks-repository";

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

      const link = await service.createLink({
        originalUrl,
        userId,
        clientId,
        campaignId,
        tags,
      });

      return reply.status(201).send(link);
    },
  );

  // Rota GET mostra todos os links
  app.withTypeProvider<ZodTypeProvider>().get(
    "/links",
    {
      onRequest: [authHook], // Protegida
      schema: {
        tags: ["Links"],
        summary: "Lista os links da organização.",
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

      const service = new LinksService(
        new PrismaLinksRepository(),
        new PrismaClientsRepository(),
        new PrismaClicksRepository(),
      );

      const links = await service.listLinks({
        clientId,
        campaignId,
        search,
      });

      return reply.status(200).send(links);
    },
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
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const service = new LinksService(
        new PrismaLinksRepository(),
        new PrismaClientsRepository(),
        new PrismaClicksRepository(),
      );

      const link = await service.getLink(id);
      return reply.send(link);
    },
  );

  // Rota PUT faz update do link
  app.withTypeProvider<ZodTypeProvider>().put(
    "/links/:id",
    {
      onRequest: [authHook],
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

      const service = new LinksService(
        new PrismaLinksRepository(),
        new PrismaClientsRepository(),
        new PrismaClicksRepository(),
      );

      const updatedLink = await service.updateLink(id, {
        originalUrl,
        clientId,
        campaignId,
      });

      return reply.status(200).send(updatedLink);
    },
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
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const service = new LinksService(
        new PrismaLinksRepository(),
        new PrismaClientsRepository(),
        new PrismaClicksRepository(),
      );

      await service.deleteLink(id);
      return reply.status(204).send();
    },
  );

  // Rota GET Metrics
  app.withTypeProvider<ZodTypeProvider>().get(
    "/links/:id/metrics",
    {
      onRequest: [authHook],
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

      const service = new LinksService(
        new PrismaLinksRepository(),
        new PrismaClientsRepository(),
        new PrismaClicksRepository(),
      );

      const metrics = await service.getLinkMetrics(id, days);
      return reply.status(200).send(metrics);
    },
  );
}
