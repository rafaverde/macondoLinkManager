import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { PrismaLinksRepository } from "../repositories/prisma/prisma-links-repository";
import { PrismaClientsRepository } from "../repositories/prisma/prisma-clients-repository";
import { LinksService } from "../services/links-service";
import { PrismaClicksRepository } from "../repositories/prisma/prisma-clicks-repository";

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
      const clicksRepo = new PrismaClicksRepository();
      const service = new LinksService(linksRepo, clientsRepo, clicksRepo);

      // Busca o link pelo código
      const link = await service.getLinkByShortCode(shortCode);

      // Se não existe, 404
      if (!link) {
        const frontendUrl = process.env.FRONTEND_URL;

        if (!frontendUrl) {
          return reply.status(404).send({ message: "Link não encontrado." });
        }
        request.log.info(
          {
            shortCode,
            ip: request.ip,
            userAgent: request.headers["user-agent"],
          },
          "Invalid short link access",
        );
        return reply.redirect(`${frontendUrl}/link-not-found`);
      }

      // Registra o clique
      const ip = request.ip;
      const userAgent = request.headers["user-agent"];

      await service.trackClick(link.id, ip, userAgent);

      request.log.debug(
        {
          shortCode,
          ip,
        },
        "Click tracked",
      );

      request.log.info(
        {
          rawIp: request.ip,
          forwardedFor: request.headers["x-forwarded-for"],
          realIp: request.headers["x-real-ip"],
        },
        "Click IP debug",
      );

      // Redireciona para a URL original
      return reply.redirect(link.originalUrl);
    },
  );
}
