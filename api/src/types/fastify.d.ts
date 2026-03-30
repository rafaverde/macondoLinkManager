import { JWT } from "@fastify/jwt";
import { OAuth2Namespace } from "@fastify/oauth2";
import type { AppServices } from "../plugins/app-services";

declare module "fastify" {
  // Adiciona a propriedade 'googleOAuth2' à interface FastifyInstance
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
    jwt: JWT;
    services: AppServices;
  }

  // Define o que vamos 'anexar' ao request.user
  interface FastifyRequest {
    user: {
      sub: string;
      name: string;
      email: string;
      avatarUrl: string | null;
    };
  }
}

// "Aumenta" o módulo '@fastify/jwt'
// Isso nos permite tipar o payload do nosso token
declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: {
      sub: string;
      name: string;
      email: string;
      avatarUrl: string | null;
    };
  }
}
