// Um erro customizado para quando a regra de negócio falhar
export class DomainNotAllowedError extends Error {
  constructor() {
    super("Access denied. This email does not belongs to the Organization.");
    this.name = "DomainNotAllowedError";
  }
}
