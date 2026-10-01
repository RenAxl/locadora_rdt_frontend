import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { PayableFilters } from '../models/PayableFilters';
import { PayableService } from './payable.service';

describe('PayableService', () => {
  let service: PayableService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(PayableService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('sends financial filters and pagination without dropping a zero minimum amount', () => {
    const filters = new PayableFilters();
    filters.search = 'Energia';
    filters.startDate = '2026-09-01';
    filters.endDate = '2026-09-30';
    filters.periodType = 'PAYMENT_DATE';
    filters.status = 'PARTIALLY_PAID';
    filters.supplierId = 5;
    filters.employeeId = 8;
    filters.paymentMethodId = 2;
    filters.paymentFrequencyId = 3;
    filters.minimumAmount = 0;
    filters.maximumAmount = 100;

    service.list(new Pagination(1, 10, 'DESC', 'amount'), filters).subscribe();

    const request = http.expectOne((item) => item.url === API.PAYABLES.ROOT);
    const params = request.request.params;
    expect(params.get('search')).toBe('Energia');
    expect(params.get('startDate')).toBe('2026-09-01');
    expect(params.get('endDate')).toBe('2026-09-30');
    expect(params.get('periodType')).toBe('PAYMENT_DATE');
    expect(params.get('status')).toBe('PARTIALLY_PAID');
    expect(params.get('supplierId')).toBe('5');
    expect(params.get('employeeId')).toBe('8');
    expect(params.get('paymentMethodId')).toBe('2');
    expect(params.get('paymentFrequencyId')).toBe('3');
    expect(params.get('minimumAmount')).toBe('0');
    expect(params.get('maximumAmount')).toBe('100');
    expect(params.get('page')).toBe('1');
    expect(params.get('linesPerPage')).toBe('10');
    expect(params.get('direction')).toBe('DESC');
    expect(params.get('orderBy')).toBe('amount');
    request.flush({ content: [], totalElements: 0 });
  });

  it('omits absent optional financial filters', () => {
    service.list(new Pagination(0, 10, 'ASC', 'dueDate'), new PayableFilters()).subscribe();

    const request = http.expectOne((item) => item.url === API.PAYABLES.ROOT);
    expect(request.request.params.has('startDate')).toBeFalse();
    expect(request.request.params.has('endDate')).toBeFalse();
    expect(request.request.params.has('supplierId')).toBeFalse();
    expect(request.request.params.has('minimumAmount')).toBeFalse();
    expect(request.request.params.has('maximumAmount')).toBeFalse();
    request.flush({ content: [], totalElements: 0 });
  });
});
