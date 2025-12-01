export class ResourcetNotFoundError extends Error {
  constructor() {
    super("Recurso não encontrado.");
    this.name = "ResourceNotFoundError";
  }
}
