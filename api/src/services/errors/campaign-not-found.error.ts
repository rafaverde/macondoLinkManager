export class CampaignNotFoundError extends Error {
  constructor() {
    super("Campanha não encontrada.");
    this.name = "CampaignNotFoundError";
  }
}
