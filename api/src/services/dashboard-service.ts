import { CampaignsRepository } from "../repositories/campaigns-repository";
import { ClicksRepository } from "../repositories/clicks-repository";
import { ClientsRepository } from "../repositories/clients-repository";
import { LinksRepository } from "../repositories/links-repository";
import { CampaignNotAllowedError } from "./errors/campaign-not-allowed-error";

export class DashboardService {
  constructor(
    private clicksRepository: ClicksRepository,
    private linksRepository: LinksRepository,
    private clientsRepository: ClientsRepository,
    private campaignsRepository: CampaignsRepository,
  ) {}

  async getGeneralMetrics(userId: string) {
    // Executa em paralelo para ser mais rápido
    const [totalClicks, activeLinks] = await Promise.all([
      this.clicksRepository.count(userId),
      this.linksRepository.count({ userId }),
    ]);

    return {
      totalClicks,
      activeLinks,
    };
  }

  async getClientGeneralMetrics(userId: string, clientId: string) {
    const [totalClicks, activeLinks] = await Promise.all([
      this.clicksRepository.countByClient(userId, clientId),
      this.linksRepository.count({ userId, clientId }),
    ]);

    return { totalClicks, activeLinks };
  }

  async getCampaignGeneralMetrics(userId: string, campaignId: string) {
    const [totalClicks, activeLinks] = await Promise.all([
      this.clicksRepository.countByCampaign(userId, campaignId),
      this.linksRepository.count({ userId, campaignId }),
    ]);

    return { totalClicks, activeLinks };
  }

  async getTopClients(userId: string) {
    const topClients = await this.clientsRepository.findTopClients(userId);

    // Mapeia para o formato que o front precisa
    return topClients.map((client) => ({
      name: client.name,
      clicks: client._count,
    }));
  }

  async getAnalyticsOverview(userId: string) {
    // Visão geral com padrão para 30 dias
    const metrics = await this.clicksRepository.getMetricsByUserId(userId, 30);
    return metrics;
  }

  async getClientAnalyticsOverview(userId: string, clientId: string) {
    return this.clicksRepository.getMetricsByClientId(userId, clientId, 30);
  }

  async getCampaignAnalyticsOverview(userId: string, campaignId: string) {
    return this.clicksRepository.getMetricsByCampaignId(userId, campaignId, 30);
  }

  async getOverview(userId: string) {
    const [general, analytics] = await Promise.all([
      this.getGeneralMetrics(userId),
      this.getAnalyticsOverview(userId),
    ]);

    const hasData = general.totalClicks > 0;

    return {
      summary: {
        totalClicks: general.totalClicks,
        activeLinks: general.activeLinks,
        period: "30d",
      },
      charts: {
        clicksByDate: analytics.clicksByDate,
        topBrowsers: analytics.topBrowsers,
        topCountries: analytics.topCountries,
        topCities: analytics.topCities,
      },
      meta: {
        hasData,
      },
    };
  }

  async getClientOverview(userId: string, clientId: string) {
    const [general, analytics] = await Promise.all([
      this.getClientGeneralMetrics(userId, clientId),
      this.getClientAnalyticsOverview(userId, clientId),
    ]);

    const hasData = general.totalClicks > 0;

    return {
      summary: {
        totalClicks: general.totalClicks,
        activeLinks: general.activeLinks,
        period: "30d",
      },
      charts: analytics,
      meta: { hasData },
    };
  }

  async getCampaignOverview(userId: string, campaignId: string) {
    const campaign = await this.campaignsRepository.findByIdAndUserId(
      campaignId,
      userId,
    );

    if (!campaign) {
      throw new CampaignNotAllowedError();
    }

    const [general, analytics] = await Promise.all([
      this.getCampaignGeneralMetrics(userId, campaignId),
      this.getCampaignAnalyticsOverview(userId, campaignId),
    ]);

    const hasData = general.totalClicks > 0;

    return {
      summary: {
        totalClicks: general.totalClicks,
        activeLinks: general.activeLinks,
        period: "30d",
      },
      charts: analytics,
      meta: { hasData },
    };
  }
}
