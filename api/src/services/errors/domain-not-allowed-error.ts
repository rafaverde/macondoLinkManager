// Um erro customizado para quando a regra de negócio falhar
export class DomainNotAllowedError extends Error {
  constructor() {
    super("Acesso negado. Esse email não faz parte dessa organização.");
    this.name = "DomainNotAllowedError";
  }
}
