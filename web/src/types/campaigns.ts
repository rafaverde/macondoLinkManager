export interface Campaign {
  id: string;
  name: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CampaignListItem {
  id: string;
  name: string;
  clientId: string;
  clientName: string;
  linksCount: number;
  createdAt: string;
  updatedAt: string;
}
