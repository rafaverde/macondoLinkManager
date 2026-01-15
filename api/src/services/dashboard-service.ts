import { ClicksRepository } from "../repositories/clicks-repository";
import { ClientsRepository } from "../repositories/clients-repository";
import { LinksRepository } from "../repositories/links-repository";

export class DashboardService {
  constructor(
    private clicksRepository: ClicksRepository,
    private linksRepository: LinksRepository,
    private clientsRepository: ClientsRepository,
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
}
