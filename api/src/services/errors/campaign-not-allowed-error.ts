export class CampaignNotAllowedError extends Error {
  constructor() {
    super("Você não tem permissão para acessar esta campanha.");
  }
}
