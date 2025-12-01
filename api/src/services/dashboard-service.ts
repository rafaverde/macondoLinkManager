import { ClicksRepository } from "../repositories/clicks-repository";
import { ClientsRepository } from "../repositories/clients-repository";
import { LinksRepository } from "../repositories/links-repository";

export class DashboardService {
  constructor(
    private clicksRepository: ClicksRepository,
    private linksRepository: LinksRepository,
    private clientsRepository: ClientsRepository
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
}
