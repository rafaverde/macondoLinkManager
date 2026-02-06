export interface Client {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientListItem {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  campaignsCount: number;
  linksCount: number;
}
