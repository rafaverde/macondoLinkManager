import { Link } from "@prisma/client";

// Interface para os filtros de listagem
export interface FindLinksParams {
  clientId?: string;
  campaignId?: string;
  search?: string;
}

export interface CreateLinkDTO {
  name: string;
  originalUrl: string;
  shortCode: string;
  userId: string; // userId = createdByUserId (Future improvement)
  clientId: string;
  campaignId?: string | null;
  tags: string[];
}

export interface UpdateLinkDTO {
  name?: string;
  originalUrl?: string;
  clientId?: string;
  campaignId?: string | null;
  tags?: string[];
}

export interface LinkWithRelations {
  id: string;
  name: string;
  shortCode: string;
  originalUrl: string;
  userId: string;
  clientId: string;
  campaignId: string | null;
  createdAt: Date;
  updatedAt: Date;

  client?: { id: string; name: string };
  campaign?: { id: string; name: string } | null;
  _count?: { clicks: number };
  tags?: { id: string; name: string }[];
}

export interface LinksRepository {
  create(data: CreateLinkDTO): Promise<LinkWithRelations>;
  findMany(params: FindLinksParams): Promise<LinkWithRelations[]>;
  findByShortCode(shortCode: string): Promise<Link | null>;
  findById(id: string): Promise<LinkWithRelations | null>;
  update(id: string, data: UpdateLinkDTO): Promise<LinkWithRelations>;
  delete(id: string): Promise<void>;
  count(params: FindLinksParams): Promise<number>;
}
