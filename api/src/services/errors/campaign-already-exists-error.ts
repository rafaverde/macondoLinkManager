export class CampaignAlreadyExistsError extends Error {
  constructor() {
    super("Esse nome de campanha já está sendo usado por esse cliente.");
    this.name = "CampaignAlreadyExistsError";
  }
}
