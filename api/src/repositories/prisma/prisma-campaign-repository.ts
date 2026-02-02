import { Campaign, Prisma } from "@prisma/client";
import { prisma } from "../../lib/prisma";
import {
  CampaignsRepository,
  CreateCampaignDTO,
} from "../campaigns-repository";

export class PrismaCampaignsRepository implements CampaignsRepository {
  async create(data: CreateCampaignDTO) {
    const campaign = await prisma.campaign.create({
      data: {
        name: data.name,
        client: {
          connect: {
            id: data.clientId,
          },
        },
      },
    });
    return campaign;
  }

  async findMany(clientId?: string) {
    const campaigns = await prisma.campaign.findMany({
      where: {
        clientId,
      },
      orderBy: { name: "asc" },
    });
    return campaigns;
  }

  async findByNameAndClientId(name: string, clientId: string) {
    const campaign = await prisma.campaign.findFirst({
      where: {
        name,
        clientId,
      },
    });

    return campaign;
  }

  async findByIdWithUserLinks(
    campaignId: string,
    userId: string,
  ): Promise<{ id: string } | null> {
    return prisma.campaign.findFirst({
      where: {
        id: campaignId,
        client: {
          links: {
            some: {},
          },
        },
      },
      select: {
        id: true,
      },
    });
  }

  async findById(campaignId: string): Promise<Campaign | null> {
    return prisma.campaign.findUnique({
      where: {
        id: campaignId,
      },
    });
  }

  async delete(id: string): Promise<void> {
    await prisma.campaign.delete({
      where: {
        id,
      },
    });
  }

  async update(
    id: string,
    data: Prisma.CampaignUpdateInput,
  ): Promise<Campaign> {
    const campaign = await prisma.campaign.update({
      where: {
        id,
      },
      data,
    });

    return campaign;
  }
}
