import {
  CreateLinkDTO,
  FindLinksParams,
  LinksRepository,
  UpdateLinkDTO,
} from "../links-repository";
import { prisma } from "../../lib/prisma";
import { Link } from "@prisma/client";

export class PrismaLinksRepository implements LinksRepository {
  async create({
    originalUrl,
    shortCode,
    userId,
    clientId,
    campaignId,
    tags,
  }: CreateLinkDTO) {
    const link = await prisma.link.create({
      data: {
        originalUrl,
        shortCode,
        userId, // Conecta via ID direto (Prisma permite isso em versões recentes)
        clientId, // Conecta via ID direto
        campaignId, // Pode ser null

        // Tags N-N
        // Estamos criando entradas na tabela intermediária 'LinkTag'
        tags: {
          create: tags.map((tagName) => ({
            // Para cada tag, criamos uma entrada na LinkTag
            tag: {
              // E conectamos a uma Tag existente OU criamos uma nova
              connectOrCreate: {
                where: { name: tagName },
                create: { name: tagName },
              },
            },
          })),
        },
      },
    });

    return link;
  }

  async findMany({ userId, campaignId, clientId }: FindLinksParams) {
    const link = await prisma.link.findMany({
      where: {
        userId, // Se for undefined, ignora e traz todos
        clientId, // Opcional
        campaignId, // Opcional
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        // Traz os dados relacionados para exibir na lista
        client: { select: { name: true } },
        campaign: { select: { name: true } },
        _count: { select: { clicks: true } }, //Traz a contagem de clicks
      },
    });

    return link;
  }

  async findByShortCode(shortCode: string) {
    const link = await prisma.link.findUnique({
      where: { shortCode },
    });

    return link;
  }

  async findById(id: string) {
    const link = await prisma.link.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return link;
  }

  async update(
    id: string,
    { originalUrl, clientId, campaignId }: UpdateLinkDTO
  ) {
    const link = await prisma.link.update({
      where: { id },
      data: {
        originalUrl,
        clientId,
        campaignId,
      },
    });

    return link;
  }

  async delete(id: string) {
    await prisma.link.delete({
      where: { id },
    });
  }
}
