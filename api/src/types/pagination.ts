export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> extends PaginationParams {
  items: T[];
  total: number;
  totalPages: number;
}

