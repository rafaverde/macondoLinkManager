import { AppError } from "../../errors/app-error";

export class CampaignAlreadyExistsError extends AppError {
  constructor() {
    super(
      "Esse nome de campanha já está sendo usado por esse cliente.",
      409,
      "conflict_or_invalid_relation",
    );
  }
}
