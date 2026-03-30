export type ErrorCategory =
  | "validation"
  | "not_found"
  | "conflict_or_invalid_relation"
  | "unauthorized"
  | "forbidden";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly category: ErrorCategory,
  ) {
    super(message);
    this.name = new.target.name;
  }
}
