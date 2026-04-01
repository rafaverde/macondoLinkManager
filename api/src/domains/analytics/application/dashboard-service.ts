import { CampaignsRepository } from "../../../repositories/campaigns-repository";
import { ClicksRepository } from "../../../repositories/clicks-repository";
import { ClientsRepository } from "../../../repositories/clients-repository";
import { LinksRepository } from "../../../repositories/links-repository";
import { CampaignNotFoundError } from "../../../services/errors/campaign-not-found.error";

export class DashboardService {
  constructor(
    private clicksRepository: ClicksRepository,
    private linksRepository: LinksRepository,
    private clientsRepository: ClientsRepository,
    private campaignsRepository: CampaignsRepository,
  ) {}

  async getOrganizationGeneralMetrics() {
    return {
      activeLinks: await this.linksRepository.count({}),
    };
  }

  async getClientGeneralMetrics(clientId: string) {
    return { activeLinks: await this.linksRepository.count({ clientId }) };
  }

  async getCampaignGeneralMetrics(campaignId: string) {
    return { activeLinks: await this.linksRepository.count({ campaignId }) };
  }

  async getTopClients() {
    const topClients = await this.clientsRepository.findTopClients();

    return topClients.map((client) => ({
      name: client.name,
      clicks: client._count,
    }));
  }

  async getOrganizationAnalyticsOverview() {
    return this.clicksRepository.getOrganizationMetrics(30);
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

    return {
      summary: {
        totalClicks: analytics.summary.totalClicks,
        activeLinks: general.activeLinks,
        last7DaysClicks: analytics.summary.last7DaysClicks,
        period: "30d",
      },
      charts: {
        clicksByDate: analytics.clicksByDate,
        topBrowsers: analytics.topBrowsers,
        topCountries: analytics.topCountries,
        topCities: analytics.topCities,
      },
      meta: {
        hasData: analytics.summary.totalClicks > 0,
      },
    };
  }

  async getClientOverview(clientId: string) {
    const [general, analytics] = await Promise.all([
      this.getClientGeneralMetrics(clientId),
      this.getClientAnalyticsOverview(clientId),
    ]);

    return {
      summary: {
        totalClicks: analytics.summary.totalClicks,
        activeLinks: general.activeLinks,
        last7DaysClicks: analytics.summary.last7DaysClicks,
        period: "30d",
      },
      charts: {
        clicksByDate: analytics.clicksByDate,
        topBrowsers: analytics.topBrowsers,
        topCountries: analytics.topCountries,
        topCities: analytics.topCities,
      },
      meta: { hasData: analytics.summary.totalClicks > 0 },
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

    return {
      summary: {
        totalClicks: analytics.summary.totalClicks,
        activeLinks: general.activeLinks,
        last7DaysClicks: analytics.summary.last7DaysClicks,
        period: "30d",
      },
      charts: {
        clicksByDate: analytics.clicksByDate,
        topBrowsers: analytics.topBrowsers,
        topCountries: analytics.topCountries,
        topCities: analytics.topCities,
      },
      meta: { hasData: analytics.summary.totalClicks > 0 },
    };
  }
}
