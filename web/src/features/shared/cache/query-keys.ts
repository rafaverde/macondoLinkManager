export interface LinksListFilters {
  clientId?: string;
  campaignId?: string;
  search?: string;
}

export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },
  clients: {
    all: ["clients"] as const,
    list: () => [...queryKeys.clients.all, "list"] as const,
    detail: (clientId: string) =>
      [...queryKeys.clients.all, "detail", clientId] as const,
  },
  campaigns: {
    all: ["campaigns"] as const,
    list: (clientId?: string) =>
      [...queryKeys.campaigns.all, "list", { clientId: clientId ?? null }] as const,
    detail: (campaignId: string) =>
      [...queryKeys.campaigns.all, "detail", campaignId] as const,
  },
  links: {
    all: ["links"] as const,
    list: (filters: LinksListFilters = {}) =>
      [
        ...queryKeys.links.all,
        "list",
        {
          clientId: filters.clientId ?? null,
          campaignId: filters.campaignId ?? null,
          search: filters.search ?? "",
        },
      ] as const,
    detail: (linkId: string) =>
      [...queryKeys.links.all, "detail", linkId] as const,
    metrics: (linkId: string) =>
      [...queryKeys.links.all, "metrics", linkId] as const,
  },
  dashboard: {
    all: ["dashboard"] as const,
    overview: () => [...queryKeys.dashboard.all, "overview"] as const,
    topClients: () => [...queryKeys.dashboard.all, "top-clients"] as const,
    client: (clientId: string) =>
      [...queryKeys.dashboard.all, "client", clientId] as const,
    campaign: (campaignId: string) =>
      [...queryKeys.dashboard.all, "campaign", campaignId] as const,
    link: (linkId: string) =>
      [...queryKeys.dashboard.all, "link", linkId] as const,
  },
};
