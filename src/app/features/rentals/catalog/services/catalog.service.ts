import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';
import { API } from 'src/app/core/config/api.config';
import { PageResponse } from 'src/app/core/models/page-response';

import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';
import { ItemDTO } from 'src/app/features/stocks/items/dtos/item-dto';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private readonly apiUrl: string = API.BASE + '/catalog';

  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
    categoryId?: number | null,
  ): Observable<PageResponse<ItemDTO>> {
    let params = buildPaginationParams(pagination, 'name', filterName);

    if (categoryId != null) {
      params = params.set('categoryId', String(categoryId));
    }

    return this.http.get<PageResponse<ItemDTO>>(this.apiUrl, { params });
  }

  findById(id: number | string): Observable<ItemDTO> {
    return this.http.get<ItemDTO>(this.apiUrl + '/' + id);
  }

  getItemImage(id: number): Observable<Blob> {
    return this.http.get(this.apiUrl + '/' + id + '/image', {
      responseType: 'blob',
    });
  }
}
