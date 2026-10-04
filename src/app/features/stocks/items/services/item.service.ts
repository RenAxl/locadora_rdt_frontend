import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';
import { API } from 'src/app/core/config/api.config';
import { PageResponse } from 'src/app/core/models/page-response';

import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';
import { ItemDTO } from '../dtos/item-dto';
import { ItemUpdateDTO } from '../dtos/item-update-dto';
import { ItemInsertDTO } from '../dtos/item-insert-dto';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
  ): Observable<PageResponse<ItemDTO>> {
    const params = buildPaginationParams(pagination, 'name', filterName);

    return this.http.get<PageResponse<ItemDTO>>(API.ITEMS.ROOT, { params });
  }

  insert(item: ItemInsertDTO): Observable<ItemDTO> {
    return this.http.post<ItemDTO>(API.ITEMS.ROOT, item);
  }

  findById(id: number | string): Observable<ItemDTO> {
    return this.http.get<ItemDTO>(API.ITEMS.BY_ID(id));
  }

  update(dto: ItemUpdateDTO): Observable<ItemDTO> {
    if (!dto.id) {
      throw new Error('Item ID is required for update');
    }
    return this.http.put<ItemDTO>(API.ITEMS.BY_ID(dto.id), dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API.ITEMS.BY_ID(id));
  }

  deleteAll(ids: number[]): Observable<void> {
    return this.http.delete<void>(API.ITEMS.DELETE_ALL, {
      body: ids,
    });
  }

  changeActive(id: number, active: boolean): Observable<void> {
    return this.http.patch<void>(API.ITEMS.CHANGE_ACTIVE(id), active);
  }

  getItemImage(id: number): Observable<Blob> {
    return this.http.get(API.ITEMS.IMAGE(id), {
      responseType: 'blob',
    });
  }

  updateImage(id: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<void>(API.ITEMS.IMAGE(id), formData);
  }
}
