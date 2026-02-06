import { prisma } from "../../lib/prisma";
import { CampaignListItem } from "./types/campaign-list.item";

export class CampaignsListRepository {
  async list(clientId?: string): Promise<CampaignListItem[]> {
    const campaigns = await prisma.campaign.findMany({
      where: {
        clientId,
      },
      orderBy: {
        name: "asc",
      },
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
    });

    return campaigns.map((campaign) => ({
      id: campaign.id,
      name: campaign.name,
      clientId: campaign.client.id,
      clientName: campaign.client.name,
      linksCount: campaign._count.links,
      createdAt: campaign.createdAt,
      updatedAt: campaign.updatedAt,
    }));
  }
}
