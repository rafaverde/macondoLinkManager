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
  topCities: { city: string; count: number }[];
}

export interface ClicksRepository {
  create(data: CreateClickDTO): Promise<Click>;
  // Link
  getMetrics(linkId: string, days: number): Promise<MetricsResult>;

  // User
  count(userId?: string): Promise<number>;
  getMetricsByUserId(userId: string, days: number): Promise<MetricsResult>;

  // Client
  countByClient(userId: string, clientId: string): Promise<number>;
  getMetricsByClientId(
    userId: string,
    clientId: string,
    days: number,
  ): Promise<MetricsResult>;

  // Campaign
  countByCampaign(userId: string, campaignId: string): Promise<number>;
  getMetricsByCampaignId(
    userId: string,
    campaignId: string,
    days: number,
  ): Promise<MetricsResult>;
}
