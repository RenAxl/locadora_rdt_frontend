import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';
import { API } from 'src/app/core/config/api.config';
import { PageResponse } from 'src/app/core/models/page-response';

import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';
import { CustomerDTO } from '../dtos/customer-dto';
import { CustomerDetailsDTO } from '../dtos/customer-details-dto';
import { CustomerUpdateDTO } from '../dtos/customer-update-dto';
import { CustomerInsertDTO } from '../dtos/customer-insert-dto';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
  ): Observable<PageResponse<CustomerDTO>> {
    const params = buildPaginationParams(pagination, 'name', filterName);

    return this.http.get<PageResponse<CustomerDTO>>(API.CUSTOMERS.ROOT, { params });
  }

  insert(customer: CustomerInsertDTO): Observable<CustomerDTO> {
    return this.http.post<CustomerDTO>(API.CUSTOMERS.ROOT, customer);
  }

  findById(id: number | string): Observable<CustomerDetailsDTO> {
    return this.http.get<CustomerDetailsDTO>(API.CUSTOMERS.BY_ID(id));
  }

  update(dto: CustomerUpdateDTO): Observable<CustomerDTO> {
    if (!dto.id) {
      throw new Error('Customer ID is required for update');
    }
    return this.http.put<CustomerDTO>(API.CUSTOMERS.BY_ID(dto.id), dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API.CUSTOMERS.BY_ID(id));
  }

  deleteAll(ids: number[]): Observable<void> {
    return this.http.delete<void>(API.CUSTOMERS.DELETE_ALL, {
      body: ids,
    });
  }

  changeActive(id: number, active: boolean): Observable<void> {
    return this.http.patch<void>(API.CUSTOMERS.CHANGE_ACTIVE(id), active);
  }

  getCustomerPhoto(id: number): Observable<Blob> {
    return this.http.get(API.CUSTOMERS.PHOTO(id), {
      responseType: 'blob',
    });
  }

  updatePhoto(id: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<void>(API.CUSTOMERS.PHOTO(id), formData);
  }
}
