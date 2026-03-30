import { AppError } from "../../errors/app-error";

export class ClientAlreadyExistsError extends AppError {
  constructor() {
    super(
      "Já existe um cliente com esse nome.",
      409,
      "conflict_or_invalid_relation",
    );
  }
}
