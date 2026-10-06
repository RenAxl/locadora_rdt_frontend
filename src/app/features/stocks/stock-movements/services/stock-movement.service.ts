import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';
import { API } from 'src/app/core/config/api.config';
import { PageResponse } from 'src/app/core/models/page-response';

import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';
import { StockMovementDTO } from '../dtos/stock-movement-dto';
import { StockMovementInsertDTO } from '../dtos/stock-movement-insert-dto';

@Injectable({
  providedIn: 'root',
})
export class StockMovementService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
  ): Observable<PageResponse<StockMovementDTO>> {
    const params = buildPaginationParams(pagination, 'name', filterName);

    return this.http.get<PageResponse<StockMovementDTO>>(API.STOCK_MOVEMENTS.ROOT, { params });
  }

  insert(stockMovement: StockMovementInsertDTO): Observable<StockMovementDTO> {
    return this.http.post<StockMovementDTO>(API.STOCK_MOVEMENTS.ROOT, stockMovement);
  }
}
