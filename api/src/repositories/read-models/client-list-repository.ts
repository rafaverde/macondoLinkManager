import { prisma } from "../../lib/prisma";
import { ClientListItem } from "./types/client-list-item";
import { ClientsListFilters } from "./types/list-pagination";
import { PaginatedResult } from "../../types/pagination";

export class ClientsListRepository {
  async list({
    search,
    page,
    pageSize,
  }: ClientsListFilters): Promise<PaginatedResult<ClientListItem>> {
    const where = search
      ? {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        }
      : undefined;

    const [clients, total] = await prisma.$transaction([
      prisma.client.findMany({
        where,
        orderBy: { name: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          _count: {
            select: {
              campaigns: true,
              links: true,
            },
          },
        },
      }),
      prisma.client.count({ where }),
    ]);

    const items = clients.map((client) => ({
      id: client.id,
      name: client.name,
      campaignsCount: client._count.campaigns,
      linksCount: client._count.links,
      createdAt: client.createdAt,
      updatedAt: client.updatedAt,
    }));

    return {
      items,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
    };
  }
}
