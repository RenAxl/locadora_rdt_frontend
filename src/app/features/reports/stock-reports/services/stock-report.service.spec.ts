import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API } from 'src/app/core/config/api.config';
import { StockReportService } from './stock-report.service';

describe('StockReportService', () => {
  let service: StockReportService;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(StockReportService);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());

  it('should request an Excel file and preserve inactive filter', () => {
    service.generate('item-units', 'xlsx', { search: 'Notebook', categoryId: 2, itemId: 4,
      active: false, status: 'ALL', conditionStatus: 'GOOD' }).subscribe();
    const request = http.expectOne(req => req.url === API.STOCK_REPORTS.GENERATE('item-units', 'xlsx'));
    expect(request.request.method).toBe('GET');
    expect(request.request.responseType).toBe('blob');
    expect(request.request.params.get('active')).toBe('false');
    expect(request.request.params.get('itemId')).toBe('4');
    expect(request.request.params.get('categoryId')).toBe('2');
    expect(request.request.params.get('conditionStatus')).toBe('GOOD');
    request.flush(new Blob());
  });

  it('should send movement type and both dates', () => {
    service.generate('movements', 'pdf', { movementType: 'EXIT', startDate: '2026-01-01', endDate: '2026-01-31' }).subscribe();
    const request = http.expectOne(req => req.url === API.STOCK_REPORTS.GENERATE('movements', 'pdf'));
    expect(request.request.params.get('movementType')).toBe('EXIT');
    expect(request.request.params.get('startDate')).toBe('2026-01-01');
    expect(request.request.params.get('endDate')).toBe('2026-01-31');
    expect(request.request.params.has('active')).toBeFalse();
    request.flush(new Blob());
  });

  it('should omit null and empty filters when requesting the summary', () => {
    service.summary({ search: '', categoryId: null, active: null }).subscribe();
    const request = http.expectOne(API.STOCK_REPORTS.SUMMARY);
    expect(request.request.params.keys()).toEqual([]);
    request.flush({ totalQuantity: 0 });
  });

  it('should request report options', () => {
    service.options().subscribe();
    const request = http.expectOne(API.STOCK_REPORTS.OPTIONS);
    expect(request.request.method).toBe('GET');
    request.flush({ categories: [], items: [] });
  });
});
