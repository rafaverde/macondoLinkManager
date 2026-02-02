import {
  CreateLinkDTO,
  FindLinksParams,
  LinksRepository,
  UpdateLinkDTO,
} from "../links-repository";
import { prisma } from "../../lib/prisma";

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
        userId, // userId = createdByUserId (Future improvemnt)
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

  async findMany({ campaignId, clientId, search }: FindLinksParams) {
    const links = await prisma.link.findMany({
      where: {
        clientId, // Opcional
        campaignId, // Opcional
        // Busca textual
        ...(search
          ? {
              OR: [
                { originalUrl: { contains: search, mode: "insensitive" } },
                { shortCode: { contains: search, mode: "insensitive" } },
                { client: { name: { contains: search, mode: "insensitive" } } },
                {
                  campaign: { name: { contains: search, mode: "insensitive" } },
                },
              ],
            }
          : {}),
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

    return links;
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
        client: {
          select: {
            id: true,
            name: true,
          },
        },
        campaign: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: {
            clicks: true,
          },
        },
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
    { originalUrl, clientId, campaignId }: UpdateLinkDTO,
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

  async count({ clientId, campaignId }: FindLinksParams) {
    const count = await prisma.link.count({
      where: {
        clientId,
        campaignId,
      },
    });

    return count;
  }
}
