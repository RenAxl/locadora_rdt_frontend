import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';
import { API } from 'src/app/core/config/api.config';
import { PageResponse } from 'src/app/core/models/page-response';

import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';
import { SupplierDTO } from '../dtos/supplier-dto';
import { SupplierUpdateDTO } from '../dtos/supplier-update-dto';
import { SupplierInsertDTO } from '../dtos/supplier-insert-dto';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
  ): Observable<PageResponse<SupplierDTO>> {
    const params = buildPaginationParams(pagination, 'name', filterName);

    return this.http.get<PageResponse<SupplierDTO>>(API.SUPPLIERS.ROOT, {
      params,
    });
  }

  insert(supplier: SupplierInsertDTO): Observable<SupplierDTO> {
    return this.http.post<SupplierDTO>(API.SUPPLIERS.ROOT, supplier);
  }

  findById(id: number | string): Observable<SupplierDTO> {
    return this.http.get<SupplierDTO>(API.SUPPLIERS.BY_ID(id));
  }

  update(dto: SupplierUpdateDTO): Observable<SupplierDTO> {
    if (!dto.id) {
      throw new Error('Supplier ID is required for update');
    }
    return this.http.put<SupplierDTO>(API.SUPPLIERS.BY_ID(dto.id), dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API.SUPPLIERS.BY_ID(id));
  }

  getSupplierImage(id: number): Observable<Blob> {
    return this.http.get(API.SUPPLIERS.IMAGE(id), {
      responseType: 'blob',
    });
  }

  updateImage(id: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<void>(API.SUPPLIERS.IMAGE(id), formData);
  }
}
