export interface PageResponse<T> {
  content: T[],
  pageNumber: number,
  pageSize: number,
  totalPages: number,
  totalElements: number,
  last: boolean,
}
