import { AppError } from "../../errors/app-error";

export class CampaignNotFoundError extends AppError {
  constructor() {
    super("Campanha não encontrada.", 404, "not_found");
  }
}
