import { Click } from "@prisma/client";

export interface CreateClickDTO {
  linkId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  country?: string | null;
  city?: string | null;
}

// Interface para resultados agregados
export interface ClicksByDate {
  date: string;
  count: number;
}

export interface MetricsResult {
  clicksByDate: ClicksByDate[];
  topBrowsers: { browser: string; count: number }[];
  topCountries: { country: string; count: number }[];
}

export interface ClicksRepository {
  create(data: CreateClickDTO): Promise<Click>;
  getMetrics(linkId: string, days: number): Promise<MetricsResult>;
  count(userId?: string): Promise<number>;
  getMetricsByUserId(userId: string, days: number): Promise<MetricsResult>;
}
