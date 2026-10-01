import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { PageResponse } from 'src/app/core/models/page-response';

import { PayableFilters } from '../models/PayableFilters';
import { PayableDTO } from '../dtos/payable-dto';
import { PayableInsertDTO } from '../dtos/payable-insert-dto';
import { PayableUpdateDTO } from '../dtos/payable-update-dto';
import { PayablePaymentDTO } from '../dtos/payable-payment-dto';
import { PayableReportDTO } from '../dtos/payable-report-dto';

@Injectable({
  providedIn: 'root',
})
export class PayableService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filters: PayableFilters,
  ): Observable<PageResponse<PayableDTO>> {
    let params = buildPaginationParams(
      pagination,
      'search',
      filters.search || filters.description,
    );
    params = params.set('status', filters.status);
    params = params.set('periodType', filters.periodType || filters.dateType);

    if (filters.startDate != null && filters.startDate !== '') {
      params = params.set('startDate', filters.startDate);
    }

    if (filters.endDate != null && filters.endDate !== '') {
      params = params.set('endDate', filters.endDate);
    }

    if (filters.supplierId != null) {
      params = params.set('supplierId', filters.supplierId);
    }

    if (filters.employeeId != null) {
      params = params.set('employeeId', filters.employeeId);
    }

    if (filters.paymentMethodId != null) {
      params = params.set('paymentMethodId', filters.paymentMethodId);
    }

    if (filters.paymentFrequencyId != null) {
      params = params.set('paymentFrequencyId', filters.paymentFrequencyId);
    }

    if (filters.minimumAmount != null) {
      params = params.set('minimumAmount', filters.minimumAmount);
    }

    if (filters.maximumAmount != null) {
      params = params.set('maximumAmount', filters.maximumAmount);
    }

    return this.http.get<PageResponse<PayableDTO>>(API.PAYABLES.ROOT, {
      params,
    });
  }

  insert(dto: PayableInsertDTO): Observable<PayableDTO> {
    return this.http.post<PayableDTO>(API.PAYABLES.ROOT, dto);
  }

  findById(id: number | string): Observable<PayableDTO> {
    return this.http.get<PayableDTO>(API.PAYABLES.BY_ID(id));
  }

  update(dto: PayableUpdateDTO): Observable<PayableDTO> {
    if (!dto.id) {
      throw new Error('Payable ID is required for update');
    }
    return this.http.put<PayableDTO>(API.PAYABLES.BY_ID(dto.id), dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API.PAYABLES.BY_ID(id));
  }

  pay(id: number, dto: PayablePaymentDTO): Observable<PayableDTO> {
    return this.http.post<PayableDTO>(API.PAYABLES.PAY(id), dto);
  }

  report(filters: PayableFilters): Observable<PayableReportDTO> {
    let params = new HttpParams()
      .set('description', filters.description || '')
      .set('status', filters.status || 'all')
      .set('dateType', filters.dateType || 'due');

    if (filters.startDate) {
      params = params.set('startDate', filters.startDate);
    }

    if (filters.endDate) {
      params = params.set('endDate', filters.endDate);
    }

    return this.http.get<PayableReportDTO>(API.PAYABLES.REPORT, {
      params,
    });
  }
}
