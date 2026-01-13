import { FastifyReply, FastifyRequest } from "fastify";
import { PrismaLinksRepository } from "../repositories/prisma/prisma-links-repository";
import { ResourcetNotFoundError } from "../services/errors/resource-not-found-error";
import { PrismaUsersRepository } from "../repositories/prisma/prisma-users-repository";

export async function requireLinkOwner(request: FastifyRequest, reply: FastifyReply ) {
  const userEmail = request.user.email;
  const linkId = (request.params as {id: string}).id

  const usersRepository = new PrismaUsersRepository()
  const linksRepository = new PrismaLinksRepository()
  
  // Busca user no repositório
  const user = await usersRepository.findByEmail(userEmail)

   if (!user) {
    return reply.status(401).send({
      message: "Usuário não encontrado.",
    });
  }

  // Buscar o link  
  const link = await linksRepository.findById(linkId)
  
  if (!link) {
    throw new ResourcetNotFoundError()
  }

  if (link.userId !== user.id) {
    return reply.status(403).send({
      message: "Você não tem permissão para acessar esse recurso."
    })
  }
}