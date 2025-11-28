import { Link } from "@prisma/client";

// Interface para os filtros de listagem
export interface FindLinksParams {
  userId: string;
  clientId?: string;
  campaignId?: string;
}

export interface CreateLinkDTO {
  originalUrl: string;
  shortCode: string;
  userId: string;
  clientId: string;
  campaignId?: string | null;
  tags: string[];
}

export interface LinksRepository {
  create(data: CreateLinkDTO): Promise<Link>;
  findMany(params: FindLinksParams): Promise<Link[]>;
  findByShortCode(shortCode: string): Promise<Link | null>;
}
