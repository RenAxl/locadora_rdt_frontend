import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';
import { API } from 'src/app/core/config/api.config';
import { PageResponse } from 'src/app/core/models/page-response';
import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';
import { CustomerDTO } from 'src/app/features/organization/customers/dtos/customer-dto';
import { ItemAvailabilityDTO } from '../dtos/item-availability-dto';
import { RentalCheckoutDTO } from '../dtos/rental-checkout-dto';
import { RentalDTO } from '../dtos/rental-dto';
import { RentalInsertDTO } from '../dtos/rental-insert-dto';
import { RentalItemUnitDTO } from '../dtos/rental-item-unit-dto';
import { RentalStatusHistoryDTO } from '../dtos/rental-status-history-dto';
import { RentalFilter } from '../models/RentalFilter';

@Injectable({
  providedIn: 'root',
})
export class RentalService {
  private rentalsUrl: string = `${API.BASE}/rentals`;

  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filter: RentalFilter,
  ): Observable<PageResponse<RentalDTO>> {
    let params = buildPaginationParams(pagination, 'number', filter.number);
    params = params.set('customer', filter.customer);
    params = params.set('status', filter.status);

    if (filter.rentalTypeId != null) {
      params = params.set('rentalTypeId', String(filter.rentalTypeId));
    }

    if (filter.dateFrom !== '') {
      const dateFrom = new Date(filter.dateFrom + 'T00:00:00');
      params = params.set('dateFrom', dateFrom.toISOString());
    }

    if (filter.dateTo !== '') {
      const dateTo = new Date(filter.dateTo + 'T23:59:59');
      params = params.set('dateTo', dateTo.toISOString());
    }

    return this.http.get<PageResponse<RentalDTO>>(this.rentalsUrl, { params });
  }

  insert(rental: RentalInsertDTO): Observable<RentalDTO> {
    return this.http.post<RentalDTO>(this.rentalsUrl, rental);
  }

  findById(id: number | string): Observable<RentalDTO> {
    return this.http.get<RentalDTO>(`${this.rentalsUrl}/${id}`);
  }

  findCurrentCustomer(): Observable<CustomerDTO> {
    return this.http.get<CustomerDTO>(`${this.rentalsUrl}/current-customer`);
  }

  start(id: number, dto: RentalCheckoutDTO): Observable<RentalDTO> {
    return this.http.patch<RentalDTO>(`${this.rentalsUrl}/${id}/start`, dto);
  }

  findAvailability(itemId: number): Observable<ItemAvailabilityDTO> {
    return this.http.get<ItemAvailabilityDTO>(
      `${this.rentalsUrl}/availability/items/${itemId}`,
    );
  }

  findRentalUnits(id: number | string): Observable<RentalItemUnitDTO[]> {
    return this.http.get<RentalItemUnitDTO[]>(`${this.rentalsUrl}/${id}/units`);
  }

  findHistory(id: number | string): Observable<RentalStatusHistoryDTO[]> {
    return this.http.get<RentalStatusHistoryDTO[]>(`${this.rentalsUrl}/${id}/history`);
  }

  receipt(id: number): Observable<Blob> {
    return this.http.get(`${this.rentalsUrl}/${id}/receipt`, {
      responseType: 'blob',
    });
  }

  fiscalCoupon(id: number): Observable<Blob> {
    return this.http.get(`${this.rentalsUrl}/${id}/fiscal-coupon`, {
      responseType: 'blob',
    });
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.rentalsUrl}/${id}`);
  }
}
