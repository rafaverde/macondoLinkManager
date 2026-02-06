import { prisma } from "../../lib/prisma";
import { ClientListItem } from "./types/client-list-item";

export class ClientListRepository {
  async list(): Promise<ClientListItem[]> {
    const clients = await prisma.client.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            campaigns: true,
            links: true,
          },
        },
      },
    });

    return clients.map((client) => ({
      id: client.id,
      name: client.name,
      campaignsCount: client._count.campaigns,
      linksCount: client._count.links,
      createdAt: client.createdAt,
    }));
  }
}
