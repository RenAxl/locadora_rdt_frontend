import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { PageResponse } from 'src/app/core/models/page-response';
import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';

import { DepartmentDTO } from '../dtos/department-dto';
import { DepartmentDetailsDTO } from '../dtos/department-details-dto';
import { DepartmentInsertDTO } from '../dtos/department-insert-dto';
import { DepartmentUpdateDTO } from '../dtos/department-update-dto';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
  ): Observable<PageResponse<DepartmentDTO>> {
    const params = buildPaginationParams(pagination, 'name', filterName);

    return this.http.get<PageResponse<DepartmentDTO>>(API.DEPARTMENTS.ROOT, { params });
  }

  insert(department: DepartmentInsertDTO): Observable<DepartmentDTO> {
    return this.http.post<DepartmentDTO>(API.DEPARTMENTS.ROOT, department);
  }

  findById(id: number | string): Observable<DepartmentDetailsDTO> {
    return this.http.get<DepartmentDetailsDTO>(API.DEPARTMENTS.BY_ID(id));
  }

  update(id: number, dto: DepartmentUpdateDTO): Observable<DepartmentDTO> {
    return this.http.put<DepartmentDTO>(API.DEPARTMENTS.BY_ID(id), dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API.DEPARTMENTS.BY_ID(id));
  }
}
