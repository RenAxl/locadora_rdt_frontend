import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { RentalReportDTO } from '../dtos/rental-report-dto';
import { RentalReportFilterDTO } from '../dtos/rental-report-filter-dto';

@Injectable({
  providedIn: 'root',
})
export class RentalReportService {
  constructor(private http: HttpClient) {}

  generate(
    reportType: string,
    format: string,
    filters: RentalReportFilterDTO,
  ): Observable<Blob> {
    const params = this.buildParams(filters);

    return this.http.get(API.RENTAL_REPORTS.GENERATE(reportType, format), {
      params,
      responseType: 'blob',
    });
  }

  comparison(filters: RentalReportFilterDTO): Observable<RentalReportDTO> {
    const params = this.buildParams(filters);

    return this.http.get<RentalReportDTO>(API.RENTAL_REPORTS.COMPARISON, {
      params,
    });
  }

  private buildParams(filters: RentalReportFilterDTO): HttpParams {
    let params = new HttpParams();

    if (filters.search != null && filters.search !== '') {
      params = params.set('search', filters.search);
    }

    if (filters.startDate != null && filters.startDate !== '') {
      params = params.set('startDate', filters.startDate);
    }

    if (filters.endDate != null && filters.endDate !== '') {
      params = params.set('endDate', filters.endDate);
    }

    if (filters.status != null && filters.status !== '') {
      params = params.set('status', filters.status);
    }

    if (filters.periodType != null && filters.periodType !== '') {
      params = params.set('periodType', filters.periodType);
    }

    if (filters.customerId != null) {
      params = params.set('customerId', filters.customerId.toString());
    }

    if (filters.rentalTypeId != null) {
      params = params.set('rentalTypeId', filters.rentalTypeId.toString());
    }

    if (filters.paymentMethodId != null) {
      params = params.set('paymentMethodId', filters.paymentMethodId.toString());
    }

    if (filters.minimumAmount != null) {
      params = params.set('minimumAmount', filters.minimumAmount.toString());
    }

    if (filters.maximumAmount != null) {
      params = params.set('maximumAmount', filters.maximumAmount.toString());
    }

    if (filters.year != null) {
      params = params.set('year', filters.year.toString());
    }

    return params;
  }
}
