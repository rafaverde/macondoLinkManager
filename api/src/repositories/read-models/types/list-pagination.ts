import { PaginationParams } from "../../../types/pagination";

export interface ClientsListFilters extends PaginationParams {
  search?: string;
}

export interface CampaignsListFilters extends PaginationParams {
  clientId?: string;
}

