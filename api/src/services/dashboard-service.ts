import { CampaignsRepository } from "../repositories/campaigns-repository";
import { ClicksRepository } from "../repositories/clicks-repository";
import { ClientsRepository } from "../repositories/clients-repository";
import { LinksRepository } from "../repositories/links-repository";
import { CampaignNotFoundError } from "./errors/campaign-not-found.error";

export class DashboardService {
  constructor(
    private clicksRepository: ClicksRepository,
    private linksRepository: LinksRepository,
    private clientsRepository: ClientsRepository,
    private campaignsRepository: CampaignsRepository,
  ) {}

  async getOrganizationGeneralMetrics() {
    // Executa em paralelo para ser mais rápido
    const [totalClicks, activeLinks] = await Promise.all([
      this.clicksRepository.countOrganization(),
      this.linksRepository.count({}),
    ]);

    return {
      totalClicks,
      activeLinks,
    };
  }

  async getClientGeneralMetrics(clientId: string) {
    const [totalClicks, activeLinks] = await Promise.all([
      this.clicksRepository.countByClient(clientId),
      this.linksRepository.count({ clientId }),
    ]);

    return { totalClicks, activeLinks };
  }

  async getCampaignGeneralMetrics(campaignId: string) {
    const [totalClicks, activeLinks] = await Promise.all([
      this.clicksRepository.countByCampaign(campaignId),
      this.linksRepository.count({ campaignId }),
    ]);

    return { totalClicks, activeLinks };
  }

  async getTopClients() {
    const topClients = await this.clientsRepository.findTopClients();

    // Mapeia para o formato que o front precisa
    return topClients.map((client) => ({
      name: client.name,
      clicks: client._count,
    }));
  }

  async getOrganizationAnalyticsOverview() {
    // Visão geral com padrão para 30 dias
    const metrics = await this.clicksRepository.getOrganizationMetrics(30);
    return metrics;
  }

  async getClientAnalyticsOverview(clientId: string) {
    return this.clicksRepository.getClientMetrics(clientId, 30);
  }

  async getCampaignAnalyticsOverview(campaignId: string) {
    return this.clicksRepository.getCampaignMetrics(campaignId, 30);
  }

  async getOverview() {
    const [general, analytics] = await Promise.all([
      this.getOrganizationGeneralMetrics(),
      this.getOrganizationAnalyticsOverview(),
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

  async getClientOverview(clientId: string) {
    const [general, analytics] = await Promise.all([
      this.getClientGeneralMetrics(clientId),
      this.getClientAnalyticsOverview(clientId),
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

  async getCampaignOverview(campaignId: string) {
    const campaign = await this.campaignsRepository.findByIdWithLinks(campaignId);

    if (!campaign) {
      throw new CampaignNotFoundError();
    }

    const [general, analytics] = await Promise.all([
      this.getCampaignGeneralMetrics(campaignId),
      this.getCampaignAnalyticsOverview(campaignId),
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
