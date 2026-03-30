/**
 * Clients são entidades globais da agência.
 * Não possuem ownership por usuário.
 * Apenas autenticação é necessária.
 */

import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { authHook } from "../hooks/auth";
import { messageResponseSchema } from "../interfaces/http/schemas/common-schemas";

// Define a forma de um cliente para a API
const clientSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const clientListSchema = z.object({
  id: z.uuid(),
  name: z.string(),
  campaignsCount: z.number().int().nonnegative(),
  linksCount: z.number().int().nonnegative(),
  createdAt: z.date(),
});

export async function clientsRoutes(app: FastifyInstance) {
  // Rota GET /clients
  app.withTypeProvider<ZodTypeProvider>().get(
    "/clients",
    {
      onRequest: [authHook],
      schema: {
        // Documenta no Swagger
        tags: ["Management"],
        summary: "Lista todos os clientes da agência.",
        response: {
          200: z.array(clientListSchema), // Retorna uma array de clientes
        },
      },
    },
    async (request, reply) => {
      const clients = await app.services.clientsListService.execute();
      return reply.status(200).send(clients);
    },
  );

  // Rota POST /clients
  app.withTypeProvider<ZodTypeProvider>().post(
    "/clients",
    {
      onRequest: [authHook], // Proteção
      schema: {
        tags: ["Management"],
        summary: "Cria um novo cliente.",
        body: z.object({
          // Espera um name no body
          name: z.string().min(3),
        }),
        response: {
          201: clientSchema, // Retorna cliente criado.
          409: messageResponseSchema, // Erro de conflito.
        },
      },
    },
    async (request, reply) => {
      const { name } = request.body;
      const client = await app.services.clientsService.createClient(name);
      return reply.status(201).send(client);
    },
  );

  // Rota GET clients by id
  app.withTypeProvider<ZodTypeProvider>().get(
    "/clients/:id",
    {
      onRequest: [authHook],
      schema: {
        tags: ["Management"],
        summary: "Obtém um cliente pelo Id",
        params: z.object({
          id: z.uuid(),
        }),
        response: {
          200: clientSchema,
          404: messageResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const client = await app.services.clientsService.getClientById(id);
      return reply.send(client);
    },
  );

  // Rota DELETE client by id
  app.withTypeProvider<ZodTypeProvider>().delete(
    "/clients/:id",
    {
      onRequest: [authHook],
      schema: {
        tags: ["Management"],
        summary:
          "Exclui um cliente e todos os dados relacionados a ele (campanhas e links).",
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

      await app.services.clientsService.deleteClient(id);
      return reply.status(204).send(null);
    },
  );

  // Rota PUT client by id
  app.withTypeProvider<ZodTypeProvider>().put(
    "/clients/:id",
    {
      onRequest: [authHook],
      schema: {
        tags: ["Management"],
        summary: "Atualiza dados de um cliente.",
        params: z.object({
          id: z.uuid(),
        }),
        body: z.object({
          name: z.string().min(3),
        }),
        response: {
          200: clientSchema,
          404: messageResponseSchema,
          409: messageResponseSchema,
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { name } = request.body;
      const client = await app.services.clientsService.updateClient(id, name);
      return reply.status(200).send(client);
    },
  );
}
