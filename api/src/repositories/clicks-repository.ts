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

  // Organization
  countOrganization(): Promise<number>;
  getOrganizationMetrics(days: number): Promise<MetricsResult>;

  // Client
  countByClient(clientId: string): Promise<number>;
  getClientMetrics(clientId: string, days: number): Promise<MetricsResult>;

  // Campaign
  countByCampaign(campaignId: string): Promise<number>;
  getCampaignMetrics(
    campaignId: string,
    days: number,
  ): Promise<MetricsResult>;
}
