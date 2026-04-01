import { CampaignsListRepository } from "../repositories/read-models/campaigns-list-repository";
import { CampaignsListFilters } from "../repositories/read-models/types/list-pagination";
import { CampaignListItem } from "../repositories/read-models/types/campaign-list.item";
import { PaginatedResult } from "../types/pagination";

export class CampaignsListService {
  constructor(private campaignsListRepository: CampaignsListRepository) {}

  async execute(
    filters: CampaignsListFilters,
  ): Promise<PaginatedResult<CampaignListItem>> {
    return this.campaignsListRepository.list(filters);
  }
}
