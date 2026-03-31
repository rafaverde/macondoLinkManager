import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { authHook } from "../hooks/auth";
import {
  messageResponseSchema,
  paginatedResponseSchema,
  paginationQuerySchema,
} from "../interfaces/http/schemas/common-schemas";
import { linkMetricsSchema, linkSchema } from "../interfaces/http/schemas/link-schemas";

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
          name: z.string().min(1),
          originalUrl: z.url(),
          clientId: z.uuid(),
          campaignId: z.uuid().nullish(),
          tags: z.array(z.string()).optional(),
        }),
        response: {
          201: linkSchema,
          400: messageResponseSchema,
          404: messageResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { name, originalUrl, clientId, campaignId, tags } = request.body;
      const userId = request.user.sub; // Pega o id do user logado no token

      const link = await app.services.linksService.createLink({
        name,
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
        summary: "Lista os links do usuário logado.",
        querystring: paginationQuerySchema.extend({
          // Filtros opcionais na URL
          clientId: z.uuid().optional(),
          campaignId: z.uuid().optional(),
          search: z.string().optional(),
        }),
        response: {
          200: paginatedResponseSchema(linkSchema),
        },
      },
    },
    async (request, reply) => {
      const { clientId, campaignId, search, page, pageSize } = request.query;

      const links = await app.services.linksService.listLinks({
        clientId,
        campaignId,
        search,
        page,
        pageSize,
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
          404: messageResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const link = await app.services.linksService.getLink(id);
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
          name: z.string().min(1).optional(),
          originalUrl: z.url().optional(),
          clientId: z.uuid().optional(),
          campaignId: z.uuid().optional().nullable(),
          tags: z.array(z.string()).optional(),
        }),
        response: {
          200: linkSchema,
          400: messageResponseSchema,
          404: messageResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { name, originalUrl, clientId, campaignId, tags } = request.body;

      const updatedLink = await app.services.linksService.updateLink(id, {
        name,
        originalUrl,
        clientId,
        campaignId,
        tags,
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
          404: messageResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      await app.services.linksService.deleteLink(id);
      return reply.status(204).send(null);
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
          200: linkMetricsSchema,
          404: messageResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { days } = request.query;

      const metrics = await app.services.linksService.getLinkMetrics(id, days);
      return reply.status(200).send(metrics);
    },
  );
}
