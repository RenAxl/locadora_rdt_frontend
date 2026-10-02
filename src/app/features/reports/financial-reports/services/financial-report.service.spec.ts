import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API } from 'src/app/core/config/api.config';

import { FinancialReportService } from './financial-report.service';

describe('FinancialReportService', () => {
  let service: FinancialReportService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(FinancialReportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call report endpoint with filters', () => {
    service
      .generate('receivables', 'pdf', {
        startDate: '2026-07-01',
        endDate: '2026-07-31',
        status: 'PAID',
        customerId: 1,
      })
      .subscribe();

    const request = httpMock.expectOne((req) => req.url === API.FINANCIAL_REPORTS.GENERATE('receivables', 'pdf'));
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('startDate')).toBe('2026-07-01');
    expect(request.request.params.get('endDate')).toBe('2026-07-31');
    expect(request.request.params.get('status')).toBe('PAID');
    expect(request.request.params.get('customerId')).toBe('1');
    request.flush(new Blob());
  });

  it('should call comparison endpoint with filters', () => {
    service.comparison({ status: 'PAID', paymentMethodId: 1 }).subscribe();

    const request = httpMock.expectOne((req) => req.url === API.FINANCIAL_REPORTS.COMPARISON);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('status')).toBe('PAID');
    expect(request.request.params.get('paymentMethodId')).toBe('1');
    request.flush({
      receivableTotal: 100,
      payableTotal: 50,
      balance: 50,
      receivableCount: 1,
      payableCount: 1,
      year: 2026,
      months: [],
    });
  });

  it('should omit empty filters and preserve zero amounts', () => {
    service.generate('financial', 'xlsx', {
      search: '',
      startDate: null,
      endDate: undefined,
      customerId: null,
      supplierId: 2,
      employeeId: 3,
      paymentMethodId: 4,
      minimumAmount: 0,
      maximumAmount: 0,
      periodType: 'PAYMENT_DATE',
      year: 2026,
    }).subscribe();

    const request = httpMock.expectOne((req) => {
      return req.url === API.FINANCIAL_REPORTS.GENERATE('financial', 'xlsx');
    });

    expect(request.request.responseType).toBe('blob');
    expect(request.request.params.has('search')).toBeFalse();
    expect(request.request.params.has('startDate')).toBeFalse();
    expect(request.request.params.has('endDate')).toBeFalse();
    expect(request.request.params.has('customerId')).toBeFalse();
    expect(request.request.params.get('supplierId')).toBe('2');
    expect(request.request.params.get('employeeId')).toBe('3');
    expect(request.request.params.get('paymentMethodId')).toBe('4');
    expect(request.request.params.get('minimumAmount')).toBe('0');
    expect(request.request.params.get('maximumAmount')).toBe('0');
    expect(request.request.params.get('periodType')).toBe('PAYMENT_DATE');
    expect(request.request.params.get('year')).toBe('2026');
    request.flush(new Blob());
  });
});
