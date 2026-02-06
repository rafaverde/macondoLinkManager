import { CampaignsListRepository } from "../repositories/read-models/campaigns-list-repository";
import { CampaignListItem } from "../repositories/read-models/types/campaign-list.item";

export class CampaignsListService {
  constructor(private campaignsListRepository: CampaignsListRepository) {}

  async execute(clientId?: string): Promise<CampaignListItem[]> {
    return this.campaignsListRepository.list(clientId);
  }
}
