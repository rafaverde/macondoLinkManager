export interface Link {
  id: string;
  originalUrl: string;
  shortCode: string;
  userId: string;
  clientId: string;
  campaignId: string | null;
  createdAt: string;
  updatedAt: string;
  client?: { name: string };
  campaign?: { name: string } | null;
  _count?: { clicks: number };
  tags?: { id: string; name: string }[];
}

export interface CreateLinkData {
  originalUrl: string;
  clientId: string;
  campaignId?: string | null;
  tags?: string[];
}
