import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { buildPaginationParams } from 'src/app/core/utils/pagination-params.util';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { PageResponse } from 'src/app/core/models/page-response';

import { ReceivableFilters } from '../models/ReceivableFilters';
import { ReceivableDTO } from '../dtos/receivable-dto';
import { ReceivableInsertDTO } from '../dtos/receivable-insert-dto';
import { ReceivableUpdateDTO } from '../dtos/receivable-update-dto';
import { ReceivablePaymentDTO } from '../dtos/receivable-payment-dto';
import { ReceivableReportDTO } from '../dtos/receivable-report-dto';

@Injectable({
  providedIn: 'root',
})
export class ReceivableService {
  constructor(private http: HttpClient) {}

  list(
    pagination: Pagination,
    filters: ReceivableFilters,
  ): Observable<PageResponse<ReceivableDTO>> {
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

    if (filters.customerId != null) {
      params = params.set('customerId', filters.customerId);
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

    return this.http.get<PageResponse<ReceivableDTO>>(API.RECEIVABLES.ROOT, {
      params,
    });
  }

  insert(dto: ReceivableInsertDTO): Observable<ReceivableDTO> {
    return this.http.post<ReceivableDTO>(API.RECEIVABLES.ROOT, dto);
  }

  findById(id: number | string): Observable<ReceivableDTO> {
    return this.http.get<ReceivableDTO>(API.RECEIVABLES.BY_ID(id));
  }

  update(dto: ReceivableUpdateDTO): Observable<ReceivableDTO> {
    if (!dto.id) {
      throw new Error('Receivable ID is required for update');
    }
    return this.http.put<ReceivableDTO>(API.RECEIVABLES.BY_ID(dto.id), dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(API.RECEIVABLES.BY_ID(id));
  }

  pay(id: number, dto: ReceivablePaymentDTO): Observable<ReceivableDTO> {
    return this.http.post<ReceivableDTO>(API.RECEIVABLES.PAY(id), dto);
  }

  report(filters: ReceivableFilters): Observable<ReceivableReportDTO> {
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

    return this.http.get<ReceivableReportDTO>(API.RECEIVABLES.REPORT, {
      params,
    });
  }

  receipt(id: number): Observable<Blob> {
    return this.http.get(API.RECEIVABLES.RECEIPT(id), {
      responseType: 'blob',
    });
  }

  fiscalCoupon(id: number): Observable<Blob> {
    return this.http.get(API.RECEIVABLES.FISCAL_COUPON(id), {
      responseType: 'blob',
    });
  }
}
