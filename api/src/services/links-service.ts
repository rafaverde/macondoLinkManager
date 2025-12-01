import { ClicksRepository } from "../repositories/clicks-repository";
import { ClientsRepository } from "../repositories/clients-repository";
import { LinksRepository } from "../repositories/links-repository";
import { generateShortCode } from "../utils/generate-short-code";
import { ClientNotFoundError } from "./errors/client-not-found-error";

interface CreateLinkRequest {
  originalUrl: string;
  userId: string;
  clientId: string;
  campaignId?: string | null;
  tags?: string[];
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
}
