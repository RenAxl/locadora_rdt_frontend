import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { ItemUnitService } from './item-unit.service';

describe('ItemUnitService active filter', () => {
  let service: ItemUnitService;
  let http: HttpTestingController;
  const pagination = new Pagination(0, 5, 'ASC', 'assetCode');

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ItemUnitService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('should send the active filter along with search and item', () => {
    service.list(pagination, 'Notebook', 44, true).subscribe();
    const request = http.expectOne(req => req.url === API.ITEM_UNITS.ROOT);
    expect(request.request.params.get('active')).toBe('true');
    expect(request.request.params.get('name')).toBe('Notebook');
    expect(request.request.params.get('itemId')).toBe('44');
    request.flush({ content: [], totalElements: 0 });
  });

  it('should send false when listing retired units', () => {
    service.list(pagination, '', undefined, false).subscribe();
    const request = http.expectOne(req => req.url === API.ITEM_UNITS.ROOT);
    expect(request.request.params.get('active')).toBe('false');
    request.flush({ content: [], totalElements: 0 });
  });

  it('should omit the filter when listing all units', () => {
    service.list(pagination, '').subscribe();
    const request = http.expectOne(req => req.url === API.ITEM_UNITS.ROOT);
    expect(request.request.params.has('active')).toBeFalse();
    request.flush({ content: [], totalElements: 0 });
  });
});
