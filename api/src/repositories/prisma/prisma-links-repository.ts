import {
  CreateLinkDTO,
  FindLinksParams,
  LinkFilters,
  LinkWithRelations,
  LinksRepository,
  UpdateLinkDTO,
} from "../links-repository";
import { prisma } from "../../lib/prisma";
import { Prisma } from "@prisma/client";

export class PrismaLinksRepository implements LinksRepository {
  private buildWhere({
    clientId,
    campaignId,
    search,
  }: LinkFilters): Prisma.LinkWhereInput {
    return {
      clientId,
      campaignId,
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
    };
  }

  private async hydrateClickCounts<T extends { id: string }>(
    links: T[],
  ): Promise<Array<T & Pick<LinkWithRelations, "validClicks" | "rawClicks">>> {
    if (links.length === 0) {
      return links.map((link) => ({
        ...link,
        rawClicks: 0,
        validClicks: 0,
      }));
    }

    const linkIds = links.map((link) => link.id);
    const [rawCounts, validCounts] = await prisma.$transaction([
      prisma.$queryRaw<Array<{ linkId: string; count: number }>>(Prisma.sql`
        SELECT
          link_id AS "linkId",
          COUNT(*)::int AS "count"
        FROM clicks
        WHERE link_id IN (${Prisma.join(linkIds)})
        GROUP BY link_id
      `),
      prisma.$queryRaw<Array<{ linkId: string; count: number }>>(Prisma.sql`
        SELECT
          link_id AS "linkId",
          COUNT(*)::int AS "count"
        FROM clicks
        WHERE link_id IN (${Prisma.join(linkIds)}) AND "isBot" = false
        GROUP BY link_id
      `),
    ]);

    const rawCountMap = new Map(rawCounts.map((item) => [item.linkId, item.count]));
    const validCountMap = new Map(
      validCounts.map((item) => [item.linkId, item.count]),
    );

    return links.map((link) => ({
      ...link,
      rawClicks: rawCountMap.get(link.id) ?? 0,
      validClicks: validCountMap.get(link.id) ?? 0,
    }));
  }

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

    const createdLink = await this.findById(link.id);

    if (!createdLink) {
      throw new Error("Unexpected null after create");
    }

    return createdLink;
  }

  async findMany({
    campaignId,
    clientId,
    search,
    page,
    pageSize,
  }: FindLinksParams) {
    const where = this.buildWhere({ clientId, campaignId, search });

    const [links, total] = await prisma.$transaction([
      prisma.link.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          client: { select: { id: true, name: true } },
          campaign: { select: { id: true, name: true } },
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
      }),
      prisma.link.count({ where }),
    ]);

    const hydratedLinks = await this.hydrateClickCounts(links);

    return {
      items: hydratedLinks.map((link) => ({
        ...link,
        tags: link.tags.map((linkTag) => linkTag.tag),
      })),
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
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
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!link) return null;

    const [hydratedLink] = await this.hydrateClickCounts([link]);

    return {
      ...hydratedLink,
      tags: link.tags.map((linkTag) => linkTag.tag),
    };
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

      const [hydratedLink] = await this.hydrateClickCounts([linkWithRelations]);

      return {
        ...hydratedLink,
        tags: linkWithRelations.tags.map((lt) => lt.tag),
      };
    });
  }

  async delete(id: string) {
    await prisma.link.delete({
      where: { id },
    });
  }

  async count({ clientId, campaignId }: LinkFilters) {
    const count = await prisma.link.count({
      where: {
        clientId,
        campaignId,
      },
    });

    return count;
  }
}
