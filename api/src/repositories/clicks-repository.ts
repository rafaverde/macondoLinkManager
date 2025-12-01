import { Click } from "@prisma/client";

export interface CreateClickDTO {
  linkId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
}

export interface ClicksRepository {
  create(data: CreateClickDTO): Promise<Click>;
}
