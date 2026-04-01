export interface Link {
  id: string;
  name: string;
  originalUrl: string;
  shortCode: string;
  userId: string;
  clientId: string;
  campaignId: string | null;
  createdAt: string;
  updatedAt: string;
  rawClicks: number;
  validClicks: number;
  client?: { name: string };
  campaign?: { name: string } | null;
  tags?: { id: string; name: string }[];
}

export interface CreateLinkData {
  name: string;
  originalUrl: string;
  clientId: string;
  campaignId?: string | null;
  tags?: string[];
}
