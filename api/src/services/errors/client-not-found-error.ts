import { AppError } from "../../errors/app-error";

export class ClientNotFoundError extends AppError {
  constructor() {
    super("Cliente não encontrado.", 404, "not_found");
  }
}
