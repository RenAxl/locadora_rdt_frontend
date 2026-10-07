import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { StockReportDTO } from '../dtos/stock-report-dto';
import { StockReportFilterDTO } from '../dtos/stock-report-filter-dto';
import { StockReportOptionsDTO } from '../dtos/stock-report-options-dto';

@Injectable({ providedIn: 'root' })
export class StockReportService {
  constructor(private http: HttpClient) {}

  generate(reportType: string, format: string, filters: StockReportFilterDTO): Observable<Blob> {
    return this.http.get(API.STOCK_REPORTS.GENERATE(reportType, format), {
      params: this.buildParams(filters), responseType: 'blob',
    });
  }

  summary(filters: StockReportFilterDTO): Observable<StockReportDTO> {
    return this.http.get<StockReportDTO>(API.STOCK_REPORTS.SUMMARY, { params: this.buildParams(filters) });
  }

  options(): Observable<StockReportOptionsDTO> {
    return this.http.get<StockReportOptionsDTO>(API.STOCK_REPORTS.OPTIONS);
  }

  private buildParams(filters: StockReportFilterDTO): HttpParams {
    let params = new HttpParams();
    if (filters.search) { params = params.set('search', filters.search); }
    if (filters.categoryId != null) { params = params.set('categoryId', filters.categoryId); }
    if (filters.itemId != null) { params = params.set('itemId', filters.itemId); }
    if (filters.active != null) { params = params.set('active', filters.active); }
    if (filters.status) { params = params.set('status', filters.status); }
    if (filters.conditionStatus) { params = params.set('conditionStatus', filters.conditionStatus); }
    if (filters.movementType) { params = params.set('movementType', filters.movementType); }
    if (filters.startDate) { params = params.set('startDate', filters.startDate); }
    if (filters.endDate) { params = params.set('endDate', filters.endDate); }
    return params;
  }
}
