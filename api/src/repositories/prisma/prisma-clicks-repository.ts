import { startOfDay, subDays } from "date-fns";
import { prisma } from "../../lib/prisma";
import {
  ClicksRepository,
  CreateClickDTO,
  MetricsResult,
} from "../clicks-repository";
import { aggregateClickMetrics } from "../../utils/aggregate-click-metrics";

export class PrismaClicksRepository implements ClicksRepository {
  private async buildMetrics(
    baseWhere: Record<string, unknown>,
    days: number,
  ): Promise<MetricsResult> {
    const periodStart = subDays(new Date(), days);
    const todayStart = startOfDay(new Date());
    const last7DaysStart = startOfDay(subDays(new Date(), 6));

    const validWhere = {
      ...baseWhere,
      isBot: false,
    };

    const [clicks, totalClicks, clicksToday, last7DaysClicks] =
      await prisma.$transaction([
        prisma.click.findMany({
          where: {
            ...validWhere,
            timestamp: {
              gte: periodStart,
            },
          },
          orderBy: {
            timestamp: "asc",
          },
        }),
        prisma.click.count({
          where: validWhere,
        }),
        prisma.click.count({
          where: {
            ...validWhere,
            timestamp: {
              gte: todayStart,
            },
          },
        }),
        prisma.click.count({
          where: {
            ...validWhere,
            timestamp: {
              gte: last7DaysStart,
            },
          },
        }),
      ]);

    return {
      summary: {
        totalClicks,
        clicksToday,
        last7DaysClicks,
      },
      ...aggregateClickMetrics(clicks, days),
    };
  }

  async create({
    linkId,
    ipAddress,
    userAgent,
    country,
    city,
    isBot,
    botReason,
    botScore,
    botSignals,
    asnNumber,
    asnOrg,
  }: CreateClickDTO) {
    const click = await prisma.click.create({
      data: {
        linkId,
        ipAddress,
        userAgent,
        country,
        city,
        isBot,
        botReason,
        botScore,
        botSignals: botSignals ?? [],
        asnNumber,
        asnOrg,
      },
    });

    return click;
  }

  async getMetrics(linkId: string, days: number): Promise<MetricsResult> {
    return this.buildMetrics({ linkId }, days);
  }

  async getOrganizationMetrics(days: number): Promise<MetricsResult> {
    return this.buildMetrics({}, days);
  }

  async getClientMetrics(
    clientId: string,
    days: number,
  ): Promise<MetricsResult> {
    return this.buildMetrics(
      {
        link: {
          clientId,
        },
      },
      days,
    );
  }

  async getCampaignMetrics(
    campaignId: string,
    days: number,
  ): Promise<MetricsResult> {
    return this.buildMetrics(
      {
        link: {
          campaignId,
        },
      },
      days,
    );
  }
}
