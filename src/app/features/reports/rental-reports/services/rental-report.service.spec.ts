import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API } from 'src/app/core/config/api.config';

import { RentalReportService } from './rental-report.service';

describe('RentalReportService', () => {
  let service: RentalReportService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(RentalReportService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should call report endpoint with rental filters', () => {
    service.generate('rentals', 'pdf', {
      search: 'LOC',
      startDate: '2026-07-01',
      endDate: '2026-07-31',
      status: 'DELIVERED',
      periodType: 'EFFECTIVE_RETURN_DATE',
      customerId: 1,
      rentalTypeId: 2,
      paymentMethodId: 3,
    }).subscribe();

    const request = httpMock.expectOne((req) => req.url === API.RENTAL_REPORTS.GENERATE('rentals', 'pdf'));
    expect(request.request.method).toBe('GET');
    expect(request.request.responseType).toBe('blob');
    expect(request.request.params.get('search')).toBe('LOC');
    expect(request.request.params.get('startDate')).toBe('2026-07-01');
    expect(request.request.params.get('endDate')).toBe('2026-07-31');
    expect(request.request.params.get('status')).toBe('DELIVERED');
    expect(request.request.params.get('periodType')).toBe('EFFECTIVE_RETURN_DATE');
    expect(request.request.params.get('customerId')).toBe('1');
    expect(request.request.params.get('rentalTypeId')).toBe('2');
    expect(request.request.params.get('paymentMethodId')).toBe('3');
    request.flush(new Blob());
  });

  it('should call comparison endpoint with filters', () => {
    service.comparison({ status: 'RENTED', year: 2026 }).subscribe();

    const request = httpMock.expectOne((req) => req.url === API.RENTAL_REPORTS.COMPARISON);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('status')).toBe('RENTED');
    expect(request.request.params.get('year')).toBe('2026');
    request.flush({ rentalTotal: 100, paidTotal: 0, rentalCount: 1, paidCount: 0, year: 2026, months: [] });
  });

  it('should omit empty filters and preserve zero amounts', () => {
    service.generate('summary-customer', 'xlsx', {
      search: '',
      startDate: null,
      customerId: null,
      rentalTypeId: null,
      paymentMethodId: null,
      minimumAmount: 0,
      maximumAmount: 0,
    }).subscribe();

    const request = httpMock.expectOne((req) => req.url === API.RENTAL_REPORTS.GENERATE('summary-customer', 'xlsx'));
    expect(request.request.params.has('search')).toBeFalse();
    expect(request.request.params.has('startDate')).toBeFalse();
    expect(request.request.params.has('customerId')).toBeFalse();
    expect(request.request.params.has('rentalTypeId')).toBeFalse();
    expect(request.request.params.has('paymentMethodId')).toBeFalse();
    expect(request.request.params.get('minimumAmount')).toBe('0');
    expect(request.request.params.get('maximumAmount')).toBe('0');
    request.flush(new Blob());
  });
});
