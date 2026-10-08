import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';
import { API } from 'src/app/core/config/api.config';
import { PageResponse } from 'src/app/core/models/page-response';

import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';
import { RentalTypeDTO } from '../dtos/rental-type-dto';
import { RentalTypeUpdateDTO } from '../dtos/rental-type-update-dto';
import { RentalTypeInsertDTO } from '../dtos/rental-type-insert-dto';

@Injectable({
  providedIn: 'root',
})
export class RentalTypeService {
  private rentalTypesUrl: string = `${API.BASE}/rental/rentaltypes`;

  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filterName: string,
  ): Observable<PageResponse<RentalTypeDTO>> {
    const params = buildPaginationParams(pagination, 'name', filterName);

    return this.http.get<PageResponse<RentalTypeDTO>>(this.rentalTypesUrl, { params });
  }

  insert(rentalType: RentalTypeInsertDTO): Observable<RentalTypeDTO> {
    return this.http.post<RentalTypeDTO>(this.rentalTypesUrl, rentalType);
  }

  findById(id: number | string): Observable<RentalTypeDTO> {
    return this.http.get<RentalTypeDTO>(`${this.rentalTypesUrl}/${id}`);
  }

  update(dto: RentalTypeUpdateDTO): Observable<RentalTypeDTO> {
    if (!dto.id) {
      throw new Error('RentalType ID is required for update');
    }
    return this.http.put<RentalTypeDTO>(`${this.rentalTypesUrl}/${dto.id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.rentalTypesUrl}/${id}`);
  }

  deleteAll(ids: number[]): Observable<void> {
    return this.http.delete<void>(`${this.rentalTypesUrl}/all`, {
      body: ids,
    });
  }

  changeActive(id: number, active: boolean): Observable<void> {
    return this.http.patch<void>(`${this.rentalTypesUrl}/${id}/active`, active);
  }

}
