export class CampaignClientMismatchError extends Error {
  constructor() {
    super("A campanha informada nao pertence ao cliente selecionado.");
    this.name = "CampaignClientMismatchError";
  }
}
