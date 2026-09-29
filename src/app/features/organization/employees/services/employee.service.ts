import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';
import { API } from 'src/app/core/config/api.config';
import { PageResponse } from 'src/app/core/models/page-response';

import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';
import { EmployeeDTO } from '../dtos/employee-dto';
import { EmployeeUpdateDTO } from '../dtos/employee-update-dto';
import { EmployeeInsertDTO } from '../dtos/employee-insert-dto';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
  ): Observable<PageResponse<EmployeeDTO>> {
    const params = buildPaginationParams(pagination, 'name', filterName);

    return this.http.get<PageResponse<EmployeeDTO>>(API.EMPLOYEES.ROOT, { params });
  }

  insert(employee: EmployeeInsertDTO): Observable<EmployeeDTO> {
    return this.http.post<EmployeeDTO>(API.EMPLOYEES.ROOT, employee);
  }

  findById(id: number | string): Observable<EmployeeDTO> {
    return this.http.get<EmployeeDTO>(API.EMPLOYEES.BY_ID(id));
  }

  update(dto: EmployeeUpdateDTO): Observable<EmployeeDTO> {
    if (!dto.id) {
      throw new Error('Employee ID is required for update');
    }
    return this.http.put<EmployeeDTO>(API.EMPLOYEES.BY_ID(dto.id), dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API.EMPLOYEES.BY_ID(id));
  }

  deleteAll(ids: number[]): Observable<void> {
    return this.http.delete<void>(API.EMPLOYEES.DELETE_ALL, {
      body: ids,
    });
  }

  changeActive(id: number, active: boolean): Observable<void> {
    return this.http.patch<void>(API.EMPLOYEES.CHANGE_ACTIVE(id), active);
  }

  getEmployeePhoto(id: number): Observable<Blob> {
    return this.http.get(API.EMPLOYEES.PHOTO(id), {
      responseType: 'blob',
    });
  }

  updatePhoto(id: number, file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<void>(API.EMPLOYEES.PHOTO(id), formData);
  }
}
