import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';
import { API } from 'src/app/core/config/api.config';
import { PageResponse } from 'src/app/core/models/page-response';
import { RentalHistoryDTO } from '../dtos/rental-history-dto';

@Injectable({
  providedIn: 'root',
})
export class RentalHistoryService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
  ): Observable<PageResponse<RentalHistoryDTO>> {
    const params = new HttpParams()
      .set('page', String(pagination.page))
      .set('linesPerPage', String(pagination.linesPerPage))
      .set('direction', String(pagination.direction))
      .set('orderBy', String(pagination.orderBy));

    return this.http.get<PageResponse<RentalHistoryDTO>>(`${API.BASE}/rental-history`, { params });
  }
}
