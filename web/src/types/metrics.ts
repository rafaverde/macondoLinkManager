export interface GeneralMetrics {
  totalClicks: number;
  activeLinks: number;
}

export interface TopClient {
  name: string;
  clicks: number;
}

export interface LinkMetrics {
  clicksByDate: { date: string; count: number }[];
  topBrowser: { browser: string; count: number }[];
  topLocations: { ip: string; count: number }[];
}
