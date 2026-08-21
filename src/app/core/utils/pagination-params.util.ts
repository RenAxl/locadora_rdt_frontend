import { HttpParams } from '@angular/common/http';
import { Pagination } from '../models/Pagination';

export function buildPaginationParams(
  pagination: Pagination,
  filterKey: string,
  filterValue: string = '',
): HttpParams {
  return new HttpParams()
    .set(filterKey, filterValue || '')
    .set('page', String(pagination.page))
    .set('linesPerPage', String(pagination.linesPerPage))
    .set('direction', String(pagination.direction))
    .set('orderBy', String(pagination.orderBy));
}
