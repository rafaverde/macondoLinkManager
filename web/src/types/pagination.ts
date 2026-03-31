export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> extends PaginationParams {
  items: T[];
  total: number;
  totalPages: number;
}

