import { Link } from "@prisma/client";
import {
  CreateLinkDTO,
  FindLinksParams,
  LinksRepository,
} from "../links-repository";
import { prisma } from "../../lib/prisma";

export class PrismaLinkRepository implements LinksRepository {
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
        userId, // Filtra pelo usuário (opcional, dependendo da regra de negócio)
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
}
