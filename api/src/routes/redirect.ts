import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { PrismaLinksRepository } from "../repositories/prisma/prisma-links-repository";
import { PrismaClientsRepository } from "../repositories/prisma/prisma-clients-repository";
import { LinksService } from "../services/links-service";

export async function redirectRoutes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/:shortCode", // Rota na raiz
    {
      schema: {
        tags: ["Public"],
        summary: "Redireciona para a URL original",
        params: z.object({
          shortCode: z.string(),
        }),
        response: {
          302: z.null(), //Redirecionamento (sem corpo)
          404: z.object({ message: z.string() }),
        },
      },
    },
    async (request, reply) => {
      const { shortCode } = request.params;

      const linksRepo = new PrismaLinksRepository();
      const clientsRepo = new PrismaClientsRepository();
      const service = new LinksService(linksRepo, clientsRepo);

      // Busca o link pelo código
      const link = await service.getLinkByShortCode(shortCode);

      // Se não existe, 404
      if (!link) {
        return reply.status(404).send({ message: "Link não encontrado." });
      }

      // Futuramente, registraremos o clique aqui

      // Redireciona para a URL original
      return reply.redirect(link.originalUrl);
    }
  );
}
