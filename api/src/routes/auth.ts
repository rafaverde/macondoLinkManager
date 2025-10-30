import fastifyOauth2 from "@fastify/oauth2";
import { FastifyInstance } from "fastify";
import { env } from "../env";
import { PrismaUsersRepository } from "../repositories/prisma/prisma-users-repository";
import { AuthService } from "../services/auth-service";
import { z } from "zod";
import { DomainNotAllowedError } from "../services/errors/domain-not-allowed-error";
import fp from "fastify-plugin";

export const authRoutes = fp(async (app: FastifyInstance) => {
  // Registra o plugin do Google Auth
  await app.register(fastifyOauth2, {
    name: "googleOAuth2",
    scope: ["email", "profile"],
    credentials: {
      client: {
        id: env.GOOGLE_CLIENT_ID,
        secret: env.GOOGLE_CLIENT_SECRET,
      },
      auth: fastifyOauth2.GOOGLE_CONFIGURATION,
    },
    startRedirectPath: "/auth/google",
    callbackUri: `http://localhost:${env.PORT}/auth/google/callback`,
  });

  // O Endpoint de callback (controller)
  app.get("/auth/google/callback", async (request, reply) => {
    // Instanciando dependências
    const usersRepository = new PrismaUsersRepository();
    const authService = new AuthService(usersRepository);

    try {
      // Pega o token do Google
      const { token } =
        await app.googleOAuth2.getAccessTokenFromAuthorizationCodeFlow(request);

      // Busca os dados do usuário no Google
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v2/userinfo",
        { headers: { Authorization: `Bearer ${token.access_token}` } }
      );

      const googleUser = await response.json();

      // Valida os dados com zod
      const userInfoSchema = z.object({
        email: z.string().email(),
        name: z.string(),
        picture: z.string().url(),
      });

      const userInfo = userInfoSchema.parse(googleUser);

      // Chama o serviço (Lógica de Negócio)
      const user = await authService.authenticateWithGoogle(userInfo);

      // Gera o token JWT, caso o serviço seja bem sucedido.
      const jwtToken = app.jwt.sign(
        {
          sub: user.id,
          name: user.name,
          avatarUrl: user.avatarUrl,
          email: user.email,
        },
        {
          expiresIn: "7d",
        }
      );

      // Envia resposta  HTTP (Cookie e redirecionamento)
      return reply
        .setCookie("macondo.token", jwtToken, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 dias
          httpOnly: true,
          sameSite: "lax",
        })
        .redirect(env.FRONTEND_URL);
    } catch (err) {
      // Lida com erros
      if (err instanceof DomainNotAllowedError) {
        return reply.status(403).send({ message: err.message });
      }

      // Loga o erro real e envia uma resposta genérica
      console.error(err);
      return reply.status(500).send({ message: "Erro interno no login." });
    }
  });
});
