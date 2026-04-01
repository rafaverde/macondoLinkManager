import { CampaignsRepository } from "../../../repositories/campaigns-repository";
import { ClicksRepository } from "../../../repositories/clicks-repository";
import { ClientsRepository } from "../../../repositories/clients-repository";
import { LinksRepository } from "../../../repositories/links-repository";
import { CampaignNotFoundError } from "../../../services/errors/campaign-not-found.error";
import { ClientNotFoundError } from "../../../services/errors/client-not-found-error";
import { resolveAsnInfo } from "../../../utils/asn";
import { recordClickBurst } from "../../../utils/bot-burst-detector";
import { detectBot } from "../../../utils/detect-bot";
import { generateShortCode } from "../../../utils/generate-short-code";
import { resolveGeoLocation } from "../../../utils/geoip";
import { CampaignClientMismatchError } from "../domain/errors/campaign-client-mismatch-error";
import { LinkNotFoundError } from "../domain/errors/link-not-found-error";

interface CreateLinkRequest {
  name: string;
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
    private campaignsRepository: CampaignsRepository,
    private clicksRepository: ClicksRepository,
  ) {}

  private async validateCampaignForClient(
    clientId: string,
    campaignId?: string | null,
  ) {
    if (!campaignId) {
      return;
    }

    const campaign = await this.campaignsRepository.findById(campaignId);

    if (!campaign) {
      throw new CampaignNotFoundError();
    }

    if (campaign.clientId !== clientId) {
      throw new CampaignClientMismatchError();
    }
  }

  async getLinkByShortCode(shortCode: string) {
    return this.linksRepository.findByShortCode(shortCode);
  }

  async createLink({
    name,
    originalUrl,
    userId,
    clientId,
    campaignId,
    tags = [],
  }: CreateLinkRequest) {
    const client = await this.clientsRepository.findById(clientId);
    if (!client) {
      throw new ClientNotFoundError();
    }

    await this.validateCampaignForClient(clientId, campaignId);

    let shortCode = generateShortCode();
    let linkAlreadyExists =
      await this.linksRepository.findByShortCode(shortCode);

    while (linkAlreadyExists) {
      shortCode = generateShortCode();
      linkAlreadyExists = await this.linksRepository.findByShortCode(shortCode);
    }

    return this.linksRepository.create({
      name,
      originalUrl,
      shortCode,
      userId,
      clientId,
      campaignId,
      tags,
    });
  }

  async listLinks(filters: {
    clientId?: string;
    campaignId?: string;
    search?: string;
    page: number;
    pageSize: number;
  }) {
    return this.linksRepository.findMany(filters);
  }

  async getLink(id: string) {
    const link = await this.linksRepository.findById(id);

    if (!link) {
      throw new LinkNotFoundError();
    }

    return link;
  }

  async updateLink(
    id: string,
    data: {
      name?: string;
      originalUrl?: string;
      clientId?: string;
      campaignId?: string | null;
      tags?: string[];
    },
  ) {
    const existingLink = await this.getLink(id);
    const nextClientId = data.clientId ?? existingLink.clientId;
    const nextCampaignId =
      data.campaignId === undefined ? existingLink.campaignId : data.campaignId;

    if (data.clientId) {
      const client = await this.clientsRepository.findById(nextClientId);
      if (!client) {
        throw new ClientNotFoundError();
      }
    }

    await this.validateCampaignForClient(nextClientId, nextCampaignId);

    return this.linksRepository.update(id, data);
  }

  async deleteLink(id: string) {
    await this.getLink(id);
    await this.linksRepository.delete(id);
  }

  async trackClick(
    linkId: string,
    ipAddress?: string | null,
    userAgent?: string | null,
    headers?: Record<string, string | string[] | undefined>,
  ) {
    const burst = recordClickBurst(ipAddress, userAgent);
    const asnInfo = ipAddress ? await resolveAsnInfo(ipAddress) : null;
    const strictDatacenter = process.env.BOT_STRICT_DATACENTER !== "false";

    const { isBot, reason, score, signals } = detectBot(userAgent, headers, {
      burst,
      asnOrg: asnInfo?.organization ?? null,
      strictDatacenter,
    });

    let country: string | null = null;
    let city: string | null = null;

    if (!isBot && ipAddress) {
      const geo = await resolveGeoLocation(ipAddress);
      country = geo?.country;
      city = geo?.city;
    }

    await this.clicksRepository.create({
      linkId,
      ipAddress: ipAddress ?? null,
      userAgent: userAgent ?? null,
      country,
      city,
      isBot,
      botReason: reason,
      botScore: score,
      botSignals: signals,
      asnNumber: asnInfo?.asn ?? null,
      asnOrg: asnInfo?.organization ?? null,
    });
  }

  async getLinkMetrics(id: string, days: number = 30) {
    await this.getLink(id);
    return this.clicksRepository.getMetrics(id, days);
  }
}
