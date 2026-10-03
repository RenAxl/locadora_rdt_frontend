import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';
import { API } from 'src/app/core/config/api.config';
import { PageResponse } from 'src/app/core/models/page-response';

import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';
import { CategoryDTO } from '../dtos/category-dto';
import { CategoryUpdateDTO } from '../dtos/category-update-dto';
import { CategoryInsertDTO } from '../dtos/category-insert-dto';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
  ): Observable<PageResponse<CategoryDTO>> {
    const params = buildPaginationParams(pagination, 'name', filterName);

    return this.http.get<PageResponse<CategoryDTO>>(API.CATEGORIES.ROOT, { params });
  }

  insert(category: CategoryInsertDTO): Observable<CategoryDTO> {
    return this.http.post<CategoryDTO>(API.CATEGORIES.ROOT, category);
  }

  findById(id: number | string): Observable<CategoryDTO> {
    return this.http.get<CategoryDTO>(API.CATEGORIES.BY_ID(id));
  }

  update(dto: CategoryUpdateDTO): Observable<CategoryDTO> {
    if (!dto.id) {
      throw new Error('Category ID is required for update');
    }
    return this.http.put<CategoryDTO>(API.CATEGORIES.BY_ID(dto.id), dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API.CATEGORIES.BY_ID(id));
  }

  deleteAll(ids: number[]): Observable<void> {
    return this.http.delete<void>(API.CATEGORIES.DELETE_ALL, {
      body: ids,
    });
  }

  changeActive(id: number, active: boolean): Observable<void> {
    return this.http.patch<void>(API.CATEGORIES.CHANGE_ACTIVE(id), active);
  }

  getCategoryImage(id: number): Observable<Blob> {
    return this.http.get(API.CATEGORIES.IMAGE(id), {
      responseType: 'blob',
    });
  }

  updateImage(id: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<void>(API.CATEGORIES.IMAGE(id), formData);
  }
}
