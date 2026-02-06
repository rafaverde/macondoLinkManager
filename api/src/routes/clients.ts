/**
 * Clients são entidades globais da agência.
 * Não possuem ownership por usuário.
 * Apenas autenticação é necessária.
 */

import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { authHook } from "../hooks/auth";
import { PrismaClientsRepository } from "../repositories/prisma/prisma-clients-repository";
import { ClientsService } from "../services/clients-service";
import { ClientAlreadyExistsError } from "../services/errors/client-already-exists-error";
import { ClientsListRepository } from "../repositories/read-models/clients-list-repository";
import { ClientsListService } from "../services/clients-list-service";

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
      const listRepository = new ClientsListRepository();
      const listService = new ClientsListService(listRepository);

      const clients = await listService.execute();
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
          409: z.object({ message: z.string() }), // Erro de conflito.
        },
      },
    },
    async (request, reply) => {
      const { name } = request.body;

      const repo = new PrismaClientsRepository();
      const service = new ClientsService(repo);

      try {
        const client = await service.createClient(name);
        return reply.status(201).send(client);
      } catch (err) {
        if (err instanceof ClientAlreadyExistsError) {
          return reply.status(409).send({ message: err.message });
        }
        throw err; // Deixa o Fastify lidar com outros erros
      }
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
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const service = new ClientsService(new PrismaClientsRepository());

      const client = await service.getClientById(id);
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
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;

      const service = new ClientsService(new PrismaClientsRepository());

      await service.deleteClient(id);
      return reply.status(204).send();
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
          404: z.object({ message: z.string() }),
          409: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const { name } = request.body;

      const service = new ClientsService(new PrismaClientsRepository());

      try {
        const client = await service.updateClient(id, name);
        return reply.status(200).send(client);
      } catch (err) {
        if (err instanceof ClientAlreadyExistsError) {
          return reply.status(409).send({ message: err.message });
        }
        throw err;
      }
    },
  );
}
