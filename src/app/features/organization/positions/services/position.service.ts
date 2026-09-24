import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';
import { API } from 'src/app/core/config/api.config';
import { PageResponse } from 'src/app/core/models/page-response';

import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';
import { PositionDTO } from '../dtos/position-dto';
import { PositionUpdateDTO } from '../dtos/position-update-dto';
import { PositionInsertDTO } from '../dtos/position-insert-dto';

@Injectable({
  providedIn: 'root',
})
export class PositionService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
  ): Observable<PageResponse<PositionDTO>> {
    const params = buildPaginationParams(pagination, 'name', filterName);

    return this.http.get<PageResponse<PositionDTO>>(API.POSITIONS.ROOT, { params });
  }

  insert(position: PositionInsertDTO): Observable<PositionDTO> {
    return this.http.post<PositionDTO>(API.POSITIONS.ROOT, position);
  }

  findById(id: number | string): Observable<PositionDTO> {
    return this.http.get<PositionDTO>(API.POSITIONS.BY_ID(id));
  }

  update(dto: PositionUpdateDTO): Observable<PositionDTO> {
    if (!dto.id) {
      throw new Error('Position ID is required for update');
    }
    return this.http.put<PositionDTO>(API.POSITIONS.BY_ID(dto.id), dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API.POSITIONS.BY_ID(id));
  }

}
