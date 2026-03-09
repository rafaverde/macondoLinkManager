import {
  CreateLinkDTO,
  FindLinksParams,
  LinksRepository,
  UpdateLinkDTO,
} from "../links-repository";
import { prisma } from "../../lib/prisma";

export class PrismaLinksRepository implements LinksRepository {
  async create({
    name,
    originalUrl,
    shortCode,
    userId,
    clientId,
    campaignId,
    tags,
  }: CreateLinkDTO) {
    const link = await prisma.link.create({
      data: {
        name,
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
                { name: { contains: search, mode: "insensitive" } },
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
        client: { select: { id: true, name: true } },
        campaign: { select: { id: true, name: true } },
        _count: { select: { clicks: true } }, //Traz a contagem de clicks
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    return links.map((link) => ({
      ...link,
      tags: link.tags.map((linkTag) => linkTag.tag),
    }));
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

    if (!link) return null;

    return { ...link, tags: link.tags.map((linkTag) => linkTag.tag) };
  }

  async update(
    id: string,
    { name, originalUrl, clientId, campaignId, tags }: UpdateLinkDTO,
  ) {
    return await prisma.$transaction(async (tx) => {
      // Atualiza dados básicos do link
      await tx.link.update({
        where: {
          id,
        },
        data: {
          name,
          originalUrl,
          clientId,
          campaignId,
        },
      });

      // Se houver tags, sincroniza
      if (tags !== undefined) {
        const normalizedTags = Array.from(
          new Set(tags.map((tag) => tag.trim()).filter(Boolean)),
        );

        // Busca ou cria todas as tags
        const resolvedTags = await Promise.all(
          normalizedTags.map((tagName) =>
            tx.tag.upsert({
              where: { name: tagName },
              update: {},
              create: { name: tagName },
            }),
          ),
        );

        // Remove relações atuais
        await tx.linkTag.deleteMany({
          where: { linkId: id },
        });

        // Cria novas relações
        if (resolvedTags.length > 0) {
          await tx.linkTag.createMany({
            data: resolvedTags.map((tag) => ({
              linkId: id,
              tagId: tag.id,
            })),
          });
        }
      }

      // Busca com include completo
      const linkWithRelations = await tx.link.findUnique({
        where: { id },
        include: {
          client: { select: { id: true, name: true } },
          campaign: { select: { id: true, name: true } },
          _count: { select: { clicks: true } },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });

      if (!linkWithRelations) {
        throw new Error("Unexpected null after update");
      }

      return {
        ...linkWithRelations,
        tags: linkWithRelations.tags.map((lt) => lt.tag),
      };
    });
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
