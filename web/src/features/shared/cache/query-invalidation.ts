import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "./query-keys";

interface DashboardInvalidationArgs {
  clientId?: string;
  campaignId?: string | null;
}

interface LinksInvalidationArgs extends DashboardInvalidationArgs {
  linkId?: string;
}

export async function invalidateDashboardData(
  queryClient: QueryClient,
  { clientId, campaignId }: DashboardInvalidationArgs = {},
) {
  await queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all });

  if (clientId) {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.dashboard.client(clientId),
    });
  }

  if (campaignId) {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.dashboard.campaign(campaignId),
    });
  }
}

export async function invalidateLinksData(
  queryClient: QueryClient,
  { clientId, campaignId, linkId }: LinksInvalidationArgs = {},
) {
  await queryClient.invalidateQueries({ queryKey: queryKeys.links.all });

  if (linkId) {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.links.detail(linkId),
    });
  }

  await invalidateDashboardData(queryClient, { clientId, campaignId });
}

export async function invalidateCampaignsData(
  queryClient: QueryClient,
  clientId?: string,
) {
  await queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });

  if (clientId) {
    await queryClient.invalidateQueries({
      queryKey: queryKeys.campaigns.list({ clientId }),
    });
  }
}

export async function invalidateClientsData(queryClient: QueryClient) {
  await queryClient.invalidateQueries({ queryKey: queryKeys.clients.all });
}
