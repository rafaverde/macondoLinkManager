import { Link } from "@prisma/client";

// Interface para os filtros de listagem
export interface FindLinksParams {
  userId?: string;
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

export interface UpdateLinkDTO {
  originalUrl?: string;
  clientId?: string;
  campaignId?: string | null;
}

export interface LinksRepository {
  create(data: CreateLinkDTO): Promise<Link>;
  findMany(params: FindLinksParams): Promise<Link[]>;
  findByShortCode(shortCode: string): Promise<Link | null>;
  findById(id: string): Promise<Link | null>;
  update(id: string, data: UpdateLinkDTO): Promise<Link>;
  delete(id: string): Promise<void>;
  count(params: FindLinksParams): Promise<number>;
}
