export class ClientNotFoundError extends Error {
  constructor() {
    super("Cliente não encontrado.");
    this.name = "ClientNotFoundError";
  }
}
