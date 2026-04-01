import { prisma } from "../../lib/prisma";
import { CampaignListItem } from "./types/campaign-list.item";
import { CampaignsListFilters } from "./types/list-pagination";
import { PaginatedResult } from "../../types/pagination";

export class CampaignsListRepository {
  async list({
    clientId,
    page,
    pageSize,
  }: CampaignsListFilters): Promise<PaginatedResult<CampaignListItem>> {
    const where = { clientId };

    const [campaigns, total] = await prisma.$transaction([
      prisma.campaign.findMany({
        where,
        orderBy: {
          name: "asc",
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: {
          client: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              links: true,
            },
          },
        },
      }),
      prisma.campaign.count({ where }),
    ]);

    const items = campaigns.map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
      clientId: campaign.client.id,
      clientName: campaign.client.name,
      linksCount: campaign._count.links,
      createdAt: campaign.createdAt,
      updatedAt: campaign.updatedAt,
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
