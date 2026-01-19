import { FastifyInstance } from "fastify";
import { authHook } from "../hooks/auth";

export async function usersRoutes(app: FastifyInstance) {
  // Endpoint GET /me
  // Opções da rota
  app.get(
    "/me",
    {
      // O authHook vai rodar antes do handler da rota
      onRequest: [authHook],
    },
    // Handler da rota, só será executado se passar no AuthHook
    async (request, reply) => {
      // Hook disponibiliza request.user e retornamos os dados do usuário que vieram como JWT validado.
      return reply.status(200).send({ user: request.user });
    },
  );
}
