import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
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

      // Busca o link pelo código
      const link = await app.services.linksService.getLinkByShortCode(shortCode);

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

      await app.services.linksService.trackClick(
        link.id,
        ip,
        userAgent,
        request.headers,
      );

      // Redireciona para a URL original
      return reply.redirect(link.originalUrl);
    },
  );
}
