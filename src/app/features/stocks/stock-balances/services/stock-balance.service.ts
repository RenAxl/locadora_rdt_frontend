import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';
import { API } from 'src/app/core/config/api.config';
import { PageResponse } from 'src/app/core/models/page-response';

import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';
import { StockBalanceDTO } from '../dtos/stock-balance-dto';
import { StockBalanceMinimumUpdateDTO } from '../dtos/stock-balance-minimum-update-dto';

@Injectable({
  providedIn: 'root',
})
export class StockBalanceService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
  ): Observable<PageResponse<StockBalanceDTO>> {
    const params = buildPaginationParams(pagination, 'name', filterName);

    return this.http.get<PageResponse<StockBalanceDTO>>(API.STOCK_BALANCES.ROOT, { params });
  }

  findById(id: number | string): Observable<StockBalanceDTO> {
    return this.http.get<StockBalanceDTO>(API.STOCK_BALANCES.BY_ID(id));
  }

  findByItemId(itemId: number | string): Observable<StockBalanceDTO> {
    return this.http.get<StockBalanceDTO>(API.STOCK_BALANCES.BY_ITEM(itemId));
  }

  updateMinimum(dto: StockBalanceMinimumUpdateDTO): Observable<StockBalanceDTO> {
    if (!dto.id) {
      throw new Error('Stock balance ID is required for update');
    }

    return this.http.patch<StockBalanceDTO>(API.STOCK_BALANCES.UPDATE_MINIMUM(dto.id), {
      minimumQuantity: dto.minimumQuantity,
    });
  }
}
