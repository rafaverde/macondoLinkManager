import { format, subDays } from "date-fns";
import { prisma } from "../../lib/prisma";
import {
  ClicksRepository,
  CreateClickDTO,
  MetricsResult,
} from "../clicks-repository";
import { parseUserAgent } from "../../utils/parse-user-agent";

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

    // Processamento em memória
    // Agrupar por Data (YYYY-MM-DD)
    const clicksByDateMap = new Map<string, number>();

    // Inicializa os últimos "days" com 0 para o gráfico não ficar com buracos
    for (let i = 0; i <= days; i++) {
      const date = subDays(new Date(), i);
      const dateString = format(date, "yyyy-MM-dd");
      clicksByDateMap.set(dateString, 0);
    }

    // Preenche com dados reais
    clicks.forEach((click) => {
      const dateString = format(click.timestamp, "yyyy-MM-dd");
      const currentCount = clicksByDateMap.get(dateString) ?? 0;
      clicksByDateMap.set(dateString, currentCount + 1);
    });

    // Converte Map para Array e ordena
    const clicksByDate = Array.from(clicksByDateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Agrupar por Browser (Simplificado do UserAgent)
    const browserMap = new Map<string, number>();
    clicks.forEach((click) => {
      const browser = parseUserAgent(click.userAgent);
      browserMap.set(browser, (browserMap.get(browser) ?? 0) + 1);
    });

    const topBrowsers = Array.from(browserMap.entries())
      .map(([browser, count]) => ({ browser, count }))
      .sort((a, b) => b.count - a.count); // Maior para menor

    // Agrupar por País
    const countryMap = new Map<string, number>();

    clicks.forEach((click) => {
      const country = click.country || "Desconhecido";
      countryMap.set(country, (countryMap.get(country) ?? 0) + 1);
    });

    const topCountries = Array.from(countryMap.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Agrupar por cidade
    const cityMap = new Map<string, number>();

    clicks.forEach((click) => {
      const city = click.city || "Desconhecida";
      cityMap.set(city, (cityMap.get(city) ?? 0) + 1);
    });

    const topCities = Array.from(cityMap.entries())
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      clicksByDate,
      topBrowsers,
      topCountries,
      topCities,
    };
  }

  async count(userId?: string) {
    const count = await prisma.click.count({
      where: {
        link: {
          userId: userId,
        },
      },
    });

    return count;
  }

  async countByClient(userId: string, clientId: string) {
    return prisma.click.count({
      where: {
        link: {
          userId,
          clientId,
        },
      },
    });
  }

  async getMetricsByUserId(
    userId: string,
    days: number,
  ): Promise<MetricsResult> {
    const startDate = subDays(new Date(), days);

    // Busca todos os cliques do user
    const clicks = await prisma.click.findMany({
      where: {
        link: {
          userId: userId,
        },
        timestamp: {
          gte: startDate,
        },
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    // Agrupar por data
    const clicksByDateMap = new Map<string, number>();
    for (let i = 0; i <= days; i++) {
      const date = subDays(new Date(), i);
      const dateString = format(date, "yyyy-MM-dd");
      clicksByDateMap.set(dateString, 0);
    }

    clicks.forEach((click) => {
      const dateString = format(click.timestamp, "yyyy-MM-dd");
      const currentCount = clicksByDateMap.get(dateString) ?? 0;
      clicksByDateMap.set(dateString, currentCount + 1);
    });

    const clicksByDate = Array.from(clicksByDateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Agrupar por Browser (Simplificado do UserAgent)
    const browserMap = new Map<string, number>();
    clicks.forEach((click) => {
      const browser = parseUserAgent(click.userAgent);
      browserMap.set(browser, (browserMap.get(browser) ?? 0) + 1);
    });

    const topBrowsers = Array.from(browserMap.entries())
      .map(([browser, count]) => ({ browser, count }))
      .sort((a, b) => b.count - a.count); // Maior para menor

    // 3. Agrupar por País
    const countryMap = new Map<string, number>();

    clicks.forEach((click) => {
      const country = click.country || "Desconhecido";
      countryMap.set(country, (countryMap.get(country) ?? 0) + 1);
    });

    const topCountries = Array.from(countryMap.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Agrupar por cidade
    const cityMap = new Map<string, number>();

    clicks.forEach((click) => {
      const city = click.city || "Desconhecida";
      cityMap.set(city, (cityMap.get(city) ?? 0) + 1);
    });

    const topCities = Array.from(cityMap.entries())
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      clicksByDate,
      topBrowsers,
      topCountries,
      topCities,
    };
  }

  async getMetricsByClientId(
    userId: string,
    clientId: string,
    days: number,
  ): Promise<MetricsResult> {
    const startDate = subDays(new Date(), days);

    const clicks = await prisma.click.findMany({
      where: {
        link: {
          userId,
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

    // Agrupar por data
    const clicksByDateMap = new Map<string, number>();
    for (let i = 0; i <= days; i++) {
      const date = subDays(new Date(), i);
      const dateString = format(date, "yyyy-MM-dd");
      clicksByDateMap.set(dateString, 0);
    }

    clicks.forEach((click) => {
      const dateString = format(click.timestamp, "yyyy-MM-dd");
      const currentCount = clicksByDateMap.get(dateString) ?? 0;
      clicksByDateMap.set(dateString, currentCount + 1);
    });

    const clicksByDate = Array.from(clicksByDateMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // Agrupar por Browser (Simplificado do UserAgent)
    const browserMap = new Map<string, number>();
    clicks.forEach((click) => {
      const browser = parseUserAgent(click.userAgent);
      browserMap.set(browser, (browserMap.get(browser) ?? 0) + 1);
    });

    const topBrowsers = Array.from(browserMap.entries())
      .map(([browser, count]) => ({ browser, count }))
      .sort((a, b) => b.count - a.count); // Maior para menor

    // 3. Agrupar por País
    const countryMap = new Map<string, number>();

    clicks.forEach((click) => {
      const country = click.country || "Desconhecido";
      countryMap.set(country, (countryMap.get(country) ?? 0) + 1);
    });

    const topCountries = Array.from(countryMap.entries())
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Agrupar por cidade
    const cityMap = new Map<string, number>();

    clicks.forEach((click) => {
      const city = click.city || "Desconhecida";
      cityMap.set(city, (cityMap.get(city) ?? 0) + 1);
    });

    const topCities = Array.from(cityMap.entries())
      .map(([city, count]) => ({ city, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      clicksByDate,
      topBrowsers,
      topCountries,
      topCities,
    };
  }
}
