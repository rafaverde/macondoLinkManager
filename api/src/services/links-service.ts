import { prisma } from "../lib/prisma";
import { LinksRepository } from "../repositories/links-repository";
import { generateShortCode } from "../utils/generate-short-code";

interface CreateLinkRequest {
  originalUrl: string;
  userId: string;
  clientId: string;
  campaignId?: string | null;
  tags?: string[];
}

export class LinksService {
  constructor(private linksRepository: LinksRepository) {}

  async createLink({
    originalUrl,
    userId,
    clientId,
    campaignId,
    tags = [],
  }: CreateLinkRequest) {
    // Gera um shortcode único
    let shortCode = generateShortCode();

    const linkAlreadyExists = await this.linksRepository.findByShortCode(
      shortCode
    );
    if (linkAlreadyExists) {
      // Se por acaso colidir, gera outro.
      shortCode = generateShortCode();
    }

    // Cria o link
    const link = await this.linksRepository.create({
      originalUrl,
      shortCode,
      userId,
      clientId,
      campaignId,
      tags,
    });

    return link;
  }

  async listLinks(
    userId: string,
    filters: { cilentId?: string; campaignId?: string }
  ) {
    const links = await this.linksRepository.findMany({
      userId,
      ...filters,
    });

    return links;
  }
}
