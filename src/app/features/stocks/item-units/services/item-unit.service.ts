import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';
import { API } from 'src/app/core/config/api.config';
import { PageResponse } from 'src/app/core/models/page-response';

import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';
import { ItemUnitDTO } from '../dtos/item-unit-dto';
import { ItemUnitUpdateDTO } from '../dtos/item-unit-update-dto';
import { ItemUnitInsertDTO } from '../dtos/item-unit-insert-dto';

@Injectable({
  providedIn: 'root',
})
export class ItemUnitService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
    itemId?: number,
  ): Observable<PageResponse<ItemUnitDTO>> {
    let params = buildPaginationParams(pagination, 'name', filterName);

    if (itemId != null) {
      params = params.set('itemId', itemId);
    }

    return this.http.get<PageResponse<ItemUnitDTO>>(API.ITEM_UNITS.ROOT, { params });
  }

  insert(item: ItemUnitInsertDTO): Observable<ItemUnitDTO> {
    return this.http.post<ItemUnitDTO>(API.ITEM_UNITS.ROOT, item);
  }

  findById(id: number | string): Observable<ItemUnitDTO> {
    return this.http.get<ItemUnitDTO>(API.ITEM_UNITS.BY_ID(id));
  }

  update(dto: ItemUnitUpdateDTO): Observable<ItemUnitDTO> {
    if (!dto.id) {
      throw new Error('Item unit ID is required for update');
    }
    return this.http.put<ItemUnitDTO>(API.ITEM_UNITS.BY_ID(dto.id), dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API.ITEM_UNITS.BY_ID(id));
  }

  deleteAll(ids: number[]): Observable<void> {
    return this.http.delete<void>(API.ITEM_UNITS.DELETE_ALL, {
      body: ids,
    });
  }

  changeActive(id: number, active: boolean): Observable<void> {
    return this.http.patch<void>(API.ITEM_UNITS.CHANGE_ACTIVE(id), active);
  }

}
