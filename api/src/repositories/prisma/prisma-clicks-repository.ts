import { subDays } from "date-fns";
import { prisma } from "../../lib/prisma";
import {
  ClicksRepository,
  CreateClickDTO,
  MetricsResult,
} from "../clicks-repository";
import { aggregateClickMetrics } from "../../utils/aggregate-click-metrics";

export class PrismaClicksRepository implements ClicksRepository {
  async create({
    linkId,
    ipAddress,
    userAgent,
    country,
    city,
  }: CreateClickDTO) {
    const click = await prisma.click.create({
      data: {
        linkId,
        ipAddress,
        userAgent,
        country,
        city,
      },
    });

    return click;
  }

  async getMetrics(linkId: string, days: number): Promise<MetricsResult> {
    // Calcula a data de corte (Ex.: 30 dias atrás)
    const startDate = subDays(new Date(), days);

    // Busca TODOS os cliques brutos desse período
    // (Isso é rápido para milhares de cliques. Se fossem milhões, usaríamos raw SQL)
    const clicks = await prisma.click.findMany({
      where: {
        linkId,
        timestamp: {
          gte: startDate, // Maior ou igual a data de corte
        },
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    return aggregateClickMetrics(clicks, days);
  }

  async count() {
    const count = await prisma.click.count();
    return count;
  }

  async countByClient(clientId: string) {
    return prisma.click.count({
      where: {
        link: {
          clientId,
        },
      },
    });
  }

  async countByCampaign(campaignId: string): Promise<number> {
    return prisma.click.count({
      where: {
        link: {
          campaignId,
        },
      },
    });
  }

  async getMetricsByUserId(days: number): Promise<MetricsResult> {
    const startDate = subDays(new Date(), days);

    // Busca todos os cliques do user
    const clicks = await prisma.click.findMany({
      where: {
        timestamp: {
          gte: startDate,
        },
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    return aggregateClickMetrics(clicks, days);
  }

  async getMetricsByClientId(
    clientId: string,
    days: number,
  ): Promise<MetricsResult> {
    const startDate = subDays(new Date(), days);

    const clicks = await prisma.click.findMany({
      where: {
        link: {
          clientId,
        },
        timestamp: {
          gte: startDate,
        },
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    return aggregateClickMetrics(clicks, days);
  }

  async getMetricsByCampaignId(
    campaignId: string,
    days: number,
  ): Promise<MetricsResult> {
    const startDate = subDays(new Date(), days);

    const clicks = await prisma.click.findMany({
      where: {
        link: {
          campaignId,
        },
        timestamp: {
          gte: startDate,
        },
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    return aggregateClickMetrics(clicks, days);
  }
}
