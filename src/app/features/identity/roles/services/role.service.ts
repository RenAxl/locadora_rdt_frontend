import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';
import { API } from 'src/app/core/config/api.config';
import { PageResponse } from 'src/app/core/models/page-response';

import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';
import { RoleDTO } from '../dtos/role.dto';
import { RoleDetailsDTO } from '../dtos/role-details-dto';
import { RoleInsertDTO } from '../dtos/role-insert-dto';
import { RolePermissionsUpdateDTO } from '../dtos/role-permissions-update-dto';

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
  ): Observable<PageResponse<RoleDTO>> {
    const params = buildPaginationParams(pagination, 'authority', filterName);

    return this.http.get<PageResponse<RoleDTO>>(API.ROLES.ROOT, { params });
  }

  insert(role: RoleInsertDTO): Observable<RoleDTO> {
    return this.http.post<RoleDTO>(API.ROLES.ROOT, role);
  }

  findById(id: number | string): Observable<RoleDetailsDTO> {
    return this.http.get<RoleDetailsDTO>(API.ROLES.BY_ID(id));
  }

  updatePermissions(
    id: number,
    role: RolePermissionsUpdateDTO,
  ): Observable<RoleDTO> {
    return this.http.put<RoleDTO>(API.ROLES.PERMISSIONS(id), role);
  }
}
