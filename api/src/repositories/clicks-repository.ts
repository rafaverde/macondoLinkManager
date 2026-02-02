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
  topCountries: { country: string | null; count: number }[];
  topCities: { city: string | null; count: number }[];
}

export interface ClicksRepository {
  create(data: CreateClickDTO): Promise<Click>;
  // Link
  getMetrics(linkId: string, days: number): Promise<MetricsResult>;

  // User
  count(): Promise<number>;
  getMetricsByUserId(days: number): Promise<MetricsResult>;

  // Client
  countByClient(clientId: string): Promise<number>;
  getMetricsByClientId(clientId: string, days: number): Promise<MetricsResult>;

  // Campaign
  countByCampaign(campaignId: string): Promise<number>;
  getMetricsByCampaignId(
    campaignId: string,
    days: number,
  ): Promise<MetricsResult>;
}
