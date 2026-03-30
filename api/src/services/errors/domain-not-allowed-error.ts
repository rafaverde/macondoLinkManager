import { AppError } from "../../errors/app-error";

export class DomainNotAllowedError extends AppError {
  constructor(public readonly email: string) {
    super(
      "Acesso negado. Esse email não faz parte dessa organização.",
      403,
      "forbidden",
    );
  }
}
