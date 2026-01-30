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
    callbackUri:
      process.env.NODE_ENV === "development"
        ? `http://localhost:${env.PORT}/auth/google/callback`
        : `${env.BASE_URL}/auth/google/callback`,
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
        { headers: { Authorization: `Bearer ${token.access_token}` } },
      );

      const googleUser = await response.json();

      // Valida os dados com zod
      const userInfoSchema = z.object({
        email: z.email(),
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
        },
      );

      request.log.info(
        {
          email: user.email,
          provider: "google",
        },
        "User logged in",
      );

      // Envia resposta  HTTP (Cookie e redirecionamento)
      return reply
        .setCookie("macondo.token", jwtToken, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7, // 7 dias
          httpOnly: true,
          sameSite: "none",
          secure: true,
        })
        .redirect(env.FRONTEND_URL);
    } catch (err) {
      // Lida com erros
      if (err instanceof DomainNotAllowedError) {
        request.log.warn(
          {
            email: err.email,
            provider: "google",
          },
          "User not allowed to access domain",
        );
        return reply.redirect(`${env.FRONTEND_URL}/?error=DOMAIN_NOT_ALLOWED`);
      }

      // Loga o erro real e envia uma resposta genérica
      request.log.error(
        {
          err,
        },
        "Unexpected error during Google authentication",
      );
      return reply.status(500).send({ message: "Erro interno no login." });
    }
  });

  // Rota de Logout
  app.post("/auth/logout", async (request, reply) => {
    // Apaga o cookie httpOnly
    reply.clearCookie("macondo.token", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
    });

    request.log.info(
      {
        userId: request.user?.sub,
      },
      "User logged out",
    );

    return reply.status(200).send({
      code: "LOGOUT_SUCCESS",
      message: "Logout realizado com sucesso.",
    });
  });
});
