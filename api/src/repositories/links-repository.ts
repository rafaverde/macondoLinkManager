import { Link } from "@prisma/client";
import { PaginatedResult, PaginationParams } from "../types/pagination";

// Interface para os filtros de listagem
export interface LinkFilters {
  clientId?: string;
  campaignId?: string;
  search?: string;
}

export interface FindLinksParams extends LinkFilters, PaginationParams {}

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
  rawClicks: number;
  validClicks: number;
  tags?: { id: string; name: string }[];
}

export interface LinksRepository {
  create(data: CreateLinkDTO): Promise<LinkWithRelations>;
  findMany(params: FindLinksParams): Promise<PaginatedResult<LinkWithRelations>>;
  findByShortCode(shortCode: string): Promise<Link | null>;
  findById(id: string): Promise<LinkWithRelations | null>;
  update(id: string, data: UpdateLinkDTO): Promise<LinkWithRelations>;
  delete(id: string): Promise<void>;
  count(params: LinkFilters): Promise<number>;
}
