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
import { ClientNotFoundError } from "../services/errors/client-not-found-error";

// Define a forma de um cliente para a API
const clientSchema = z.object({
  id: z.uuid(),
  name: z.string(),
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
          200: z.array(clientSchema), // Retorna uma array de clientes
        },
      },
    },
    async (request, reply) => {
      const repo = new PrismaClientsRepository();
      const service = new ClientsService(repo);

      const clients = await service.listClients();
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
          200: z.object({
            id: z.uuid(),
            name: z.string(),
            createdAt: z.date(),
          }),
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { id } = request.params;
      const userId = request.user.sub;

      const service = new ClientsService(new PrismaClientsRepository());

      const client = await service.getClientById(userId, id);
      return reply.send(client);
    },
  );
}
