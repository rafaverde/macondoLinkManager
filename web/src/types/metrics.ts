export interface OverviewSummary {
  totalClicks: number;
  activeLinks: number;
  period: string;
}

export interface ClicksByDate {
  date: string;
  count: number;
}

export interface TopBrowser {
  browser: string;
  count: number;
}

export interface TopCountry {
  country: string;
  count: number;
}

export interface TopCity {
  city: string;
  count: number;
}

export interface OverviewCharts {
  clicksByDate: ClicksByDate[];
  topBrowsers: TopBrowser[];
  topCountries: TopCountry[];
  topCities: TopCity[];
}

export interface OverviewMeta {
  hasData: boolean;
}

export interface OverviewMetrics {
  summary: OverviewSummary;
  charts: OverviewCharts;
  meta: OverviewMeta;
}

export interface LinkMetrics {
  clicksByDate: ClicksByDate[];
  topBrowsers: TopBrowser[];
  topCountries: TopCountry[];
  topCities: TopCity[];
}

// Deprecated - Mantemos separado (por enquanto)
export interface TopClient {
  name: string;
  clicks: number;
}
