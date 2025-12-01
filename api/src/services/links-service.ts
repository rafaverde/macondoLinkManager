import { ClicksRepository } from "../repositories/clicks-repository";
import { ClientsRepository } from "../repositories/clients-repository";
import { LinksRepository } from "../repositories/links-repository";
import { generateShortCode } from "../utils/generate-short-code";
import { ClientNotFoundError } from "./errors/client-not-found-error copy";
import { LinkNotFoundError } from "./errors/link-not-found-error";

interface CreateLinkRequest {
  originalUrl: string;
  userId: string;
  clientId: string;
  campaignId?: string | null;
  tags?: string[];
}

export class NotAllowedError extends Error {
  constructor() {
    super("Você não tem permissão para alterar este link.");
  }
}

export class LinksService {
  constructor(
    private linksRepository: LinksRepository,
    private clientsRepository: ClientsRepository,
    private clicksRepository: ClicksRepository
  ) {}

  // Método público que busca por ShortCode (usado no redirecionamento)
  async getLinkByShortCode(shortCode: string) {
    const link = await this.linksRepository.findByShortCode(shortCode);
    return link;
  }

  async createLink({
    originalUrl,
    userId,
    clientId,
    campaignId,
    tags = [],
  }: CreateLinkRequest) {
    // Validação se cliente existe
    const client = await this.clientsRepository.findById(clientId);
    if (!client) {
      throw new ClientNotFoundError(); // Erro cliente não encontrado
    }

    // Gera um shortcode único
    let shortCode = generateShortCode();

    let linkAlreadyExists = await this.linksRepository.findByShortCode(
      shortCode
    );

    // Retry logic, tenta maus uma vez se colidir
    while (linkAlreadyExists) {
      shortCode = generateShortCode();
      linkAlreadyExists = await this.linksRepository.findByShortCode(shortCode);
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

  async trackClick(linkId: string, ipAddress?: string, userAgent?: string) {
    await this.clicksRepository.create({
      linkId,
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
    });
  }

  async listLinks(filters: {
    userId: string;
    clientId?: string;
    campaignId?: string;
  }) {
    const links = await this.linksRepository.findMany(filters);
    return links;
  }

  async getLink(id: string, userId: string) {
    const link = await this.linksRepository.findById(id);

    if (!link) {
      return null;
    }

    if (link.userId !== userId) {
      throw new NotAllowedError();
    }

    return link;
  }

  async updateLink(
    id: string,
    userId: string,
    data: {
      originalUrl?: string;
      clientId?: string;
      campaignId?: string | null;
    }
  ) {
    const link = await this.getLink(id, userId);

    if (!link) {
      throw new LinkNotFoundError();
    }

    if (data.clientId) {
      const client = await this.clientsRepository.findById(data.clientId);
      if (!client) throw new ClientNotFoundError();
    }

    const updatedLink = await this.linksRepository.update(id, data);
    return updatedLink;
  }

  async deleteLink(id: string, userId: string) {
    const link = await this.getLink(id, userId);

    if (!link) {
      throw new LinkNotFoundError();
    }

    await this.linksRepository.delete(id);
  }
}
