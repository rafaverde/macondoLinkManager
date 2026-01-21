import { Click } from "@prisma/client";
import { MetricsResult } from "../repositories/clicks-repository";
import { format, subDays } from "date-fns";
import { parseUserAgent } from "./parse-user-agent";

export function aggregateClickMetrics(
  clicks: Click[],
  days: number,
): MetricsResult {
  // ==== Clicks By Date ====
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

  // ==== Browsers ====
  // Agrupar por Browser (Simplificado do UserAgent)
  const browserMap = new Map<string, number>();
  clicks.forEach((click) => {
    const browser = parseUserAgent(click.userAgent);
    browserMap.set(browser, (browserMap.get(browser) ?? 0) + 1);
  });

  const topBrowsers = Array.from(browserMap.entries())
    .map(([browser, count]) => ({ browser, count }))
    .sort((a, b) => b.count - a.count); // Maior para menor

  // ==== Countries ====
  // Agrupar por País
  const countryMap = new Map<string, number>();

  clicks.forEach((click) => {
    const country = click.country || null;
    countryMap.set(
      country ?? "__unknown__",
      (countryMap.get(country ?? "__unknown__") ?? 0) + 1,
    );
  });

  const topCountries = Array.from(countryMap.entries())
    .map(([country, count]) => ({
      country: country === "__unknown__" ? null : country,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  // ==== Cities ====
  // Agrupar por cidade
  const cityMap = new Map<string, number>();

  clicks.forEach((click) => {
    const city = click.city || null;
    cityMap.set(
      city ?? "__unknown__",
      (cityMap.get(city ?? "__unknown__") ?? 0) + 1,
    );
  });

  const topCities = Array.from(cityMap.entries())
    .map(([city, count]) => ({
      city: city === "__unknown__" ? null : city,
      count,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    clicksByDate,
    topBrowsers,
    topCountries,
    topCities,
  };
}
