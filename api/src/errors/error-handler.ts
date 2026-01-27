import { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import z, { ZodError } from "zod";
import { LinkNotFoundError } from "../services/errors/link-not-found-error";
import { ClientNotFoundError } from "../services/errors/client-not-found-error";
import { CampaignNotFoundError } from "../services/errors/campaign-not-found.error";

export function errorHandler(
  error: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply,
) {
  //Validação Zod
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: "Erro de validação.",
      issues: z.treeifyError(error),
    });
  }

  // Erros de domínio (404)
  if (
    error instanceof LinkNotFoundError ||
    error instanceof ClientNotFoundError ||
    error instanceof CampaignNotFoundError
  ) {
    return reply.status(404).send({
      message: error.message,
    });
  }

  //Erros desconhecidos
  request.log.error(error);

  return reply.status(500).send({
    message: "Erro interno do servidor.",
  });
}
