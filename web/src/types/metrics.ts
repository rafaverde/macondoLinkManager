export interface OverviewSummary {
  totalClicks: number;
  activeLinks: number;
  last7DaysClicks: number;
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
  country: string | null;
  count: number;
}

export interface TopCity {
  city: string | null;
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
  summary: {
    totalClicks: number;
    clicksToday: number;
    last7DaysClicks: number;
  };
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
