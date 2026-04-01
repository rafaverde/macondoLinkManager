import { Click } from "@prisma/client";

export interface CreateClickDTO {
  linkId: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  country?: string | null;
  city?: string | null;
  isBot: boolean;
  botReason?: string;
  botScore?: number;
  botSignals?: string[];
  asnNumber?: number | null;
  asnOrg?: string | null;
}

// Interface para resultados agregados
export interface ClicksByDate {
  date: string;
  count: number;
}

export interface MetricsSummary {
  totalClicks: number;
  clicksToday: number;
  last7DaysClicks: number;
}

export interface MetricsResult {
  summary: MetricsSummary;
  clicksByDate: ClicksByDate[];
  topBrowsers: { browser: string; count: number }[];
  topCountries: { country: string | null; count: number }[];
  topCities: { city: string | null; count: number }[];
}

export interface ClicksRepository {
  create(data: CreateClickDTO): Promise<Click>;
  // Link
  getMetrics(linkId: string, days: number): Promise<MetricsResult>;
  getOrganizationMetrics(days: number): Promise<MetricsResult>;

  // Client
  getClientMetrics(clientId: string, days: number): Promise<MetricsResult>;

  // Campaign
  getCampaignMetrics(
    campaignId: string,
    days: number,
  ): Promise<MetricsResult>;
}
