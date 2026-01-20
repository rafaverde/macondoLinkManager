import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { PrismaLinksRepository } from "../repositories/prisma/prisma-links-repository";
import { PrismaClientsRepository } from "../repositories/prisma/prisma-clients-repository";
import { LinksService } from "../services/links-service";
import { PrismaClicksRepository } from "../repositories/prisma/prisma-clicks-repository";
import { getPublicClientIp } from "../utils/get-public-client-ip";

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

      const service = new LinksService(
        new PrismaLinksRepository(),
        new PrismaClientsRepository(),
        new PrismaClicksRepository(),
      );

      // Busca o link pelo código
      const link = await service.getLinkByShortCode(shortCode);

      // Se não existe, 404
      if (!link) {
        request.log.info(
          {
            shortCode,
            ip: request.ip,
            userAgent: request.headers["user-agent"],
          },
          "Invalid short link access",
        );
        return reply.redirect(`${process.env.FRONTEND_URL}/link-not-found`);
      }

      // Registra o clique
      const ip = getPublicClientIp(request);
      const userAgent = request.headers["user-agent"];

      request.log.info(
        {
          getClientIpResult: ip,
          xForwardedFor: request.headers["x-forwarded-for"],
          xRealIp: request.headers["x-real-ip"],
          rawRequestIp: request.ip,
        },
        "IP resolution before trackClick",
      );

      await service.trackClick(link.id, ip, userAgent);

      request.log.info(
        {
          shortCode,
          ip,
        },
        "Click tracked",
      );

      // Redireciona para a URL original
      return reply.redirect(link.originalUrl);
    },
  );
}
