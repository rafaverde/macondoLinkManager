import { Campaign, Prisma } from "@prisma/client";

// DTO (Data Transfer Object) para criar uma campanha
// Ele espera um name e um clientId
export interface CreateCampaignDTO {
  name: string;
  clientId: string;
}

// Interface que define as obrigações do repositório de Campanhas
export interface CampaignsRepository {
  create(data: CreateCampaignDTO): Promise<Campaign>;
  findMany(clientId?: string): Promise<Campaign[]>;
  findByNameAndClientId(
    name: string,
    clientId: string,
  ): Promise<Campaign | null>;
  findByIdWithUserLinks(
    campaignId: string,
    userId: string,
  ): Promise<{ id: string } | null>;
  findById(campaignId: string): Promise<Campaign | null>;
  delete(id: string): Promise<void>;
  update(id: string, data: Prisma.CampaignUpdateInput): Promise<Campaign>;
}
