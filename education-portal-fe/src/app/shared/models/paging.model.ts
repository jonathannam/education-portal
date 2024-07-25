export interface PagingQueryParams {
  pageIndex: number;
  pageSize: number;
}

export interface PagingResponse<T> {
  items: T[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
}
