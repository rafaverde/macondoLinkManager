import { AppError } from "../../../../errors/app-error";

export class CampaignClientMismatchError extends AppError {
  constructor() {
    super(
      "A campanha informada nao pertence ao cliente selecionado.",
      400,
      "conflict_or_invalid_relation",
    );
  }
}
