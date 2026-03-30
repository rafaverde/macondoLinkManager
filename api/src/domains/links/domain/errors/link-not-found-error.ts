import { AppError } from "../../../../errors/app-error";

export class LinkNotFoundError extends AppError {
  constructor() {
    super("Link não encontrado.", 404, "not_found");
  }
}
