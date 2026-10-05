import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { ItemUnitDTO } from '../dtos/item-unit-dto';
import { ItemUnitInsertDTO } from '../dtos/item-unit-insert-dto';
import { ItemUnitUpdateDTO } from '../dtos/item-unit-update-dto';
import { ItemUnitService } from './item-unit.service';

describe('ItemUnitService', () => {
  let service: ItemUnitService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ItemUnitService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should list units with item filter and server pagination', () => {
    const pagination = new Pagination(1, 10, 'DESC', 'assetCode');
    const unit = new ItemUnitDTO({ id: 1, assetCode: 'PS5-001' });
    service.list(pagination, 'PS5', 2).subscribe((data) => {
      expect(data.totalElements).toBe(1);
      expect(data.content[0].assetCode).toBe('PS5-001');
    });

    const request = httpMock.expectOne((req) => req.url === API.ITEM_UNITS.ROOT);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('name')).toBe('PS5');
    expect(request.request.params.get('itemId')).toBe('2');
    expect(request.request.params.get('page')).toBe('1');
    expect(request.request.params.get('linesPerPage')).toBe('10');
    expect(request.request.params.get('direction')).toBe('DESC');
    expect(request.request.params.get('orderBy')).toBe('assetCode');
    request.flush({ content: [unit], totalElements: 1 });
  });

  it('should propagate a list failure', () => {
    service.list(new Pagination(), '').subscribe({
      next: () => fail('Expected HTTP error'),
      error: (error: HttpErrorResponse) => expect(error.status).toBe(403),
    });
    const request = httpMock.expectOne((req) => req.url === API.ITEM_UNITS.ROOT);
    request.flush({}, { status: 403, statusText: 'Forbidden' });
  });

  it('should find a unit by id', () => {
    service.findById(1).subscribe((data) => expect(data.id).toBe(1));
    const request = httpMock.expectOne(API.ITEM_UNITS.BY_ID(1));
    expect(request.request.method).toBe('GET');
    request.flush({ id: 1 });
  });

  it('should propagate a missing unit failure', () => {
    service.findById(1).subscribe({
      next: () => fail('Expected HTTP error'),
      error: (error: HttpErrorResponse) => expect(error.status).toBe(404),
    });
    const request = httpMock.expectOne(API.ITEM_UNITS.BY_ID(1));
    request.flush({}, { status: 404, statusText: 'Not Found' });
  });

  it('should insert a unit without changing rental status', () => {
    const dto = new ItemUnitInsertDTO({ itemId: 2, assetCode: 'PS5-001', conditionStatus: 'GOOD' });
    service.insert(dto).subscribe((data) => expect(data.id).toBe(1));
    const request = httpMock.expectOne(API.ITEM_UNITS.ROOT);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(dto);
    expect(request.request.body.status).toBeUndefined();
    expect(request.request.body.active).toBeUndefined();
    request.flush({ id: 1 }, { status: 201, statusText: 'Created' });
  });

  it('should propagate a duplicate unit failure', () => {
    service.insert(new ItemUnitInsertDTO({ itemId: 2, assetCode: 'PS5-001' })).subscribe({
      next: () => fail('Expected HTTP error'),
      error: (error: HttpErrorResponse) => expect(error.status).toBe(400),
    });
    const request = httpMock.expectOne(API.ITEM_UNITS.ROOT);
    request.flush({}, { status: 400, statusText: 'Bad Request' });
  });

  it('should update unit metadata', () => {
    const dto = new ItemUnitUpdateDTO({ id: 1, itemId: 2, assetCode: 'PS5-002' });
    service.update(dto).subscribe((data) => expect(data.assetCode).toBe('PS5-002'));
    const request = httpMock.expectOne(API.ITEM_UNITS.BY_ID(1));
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(dto);
    request.flush({ id: 1, assetCode: 'PS5-002' });
  });

  it('should reject an update without id', () => {
    expect(() => service.update(new ItemUnitUpdateDTO())).toThrowError('Item unit ID is required for update');
    httpMock.expectNone(API.ITEM_UNITS.ROOT);
  });

  it('should delete a unit', () => {
    service.delete(1).subscribe();
    const request = httpMock.expectOne(API.ITEM_UNITS.BY_ID(1));
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });

  it('should propagate a linked unit deletion failure', () => {
    service.delete(1).subscribe({
      next: () => fail('Expected HTTP error'),
      error: (error: HttpErrorResponse) => expect(error.status).toBe(400),
    });
    const request = httpMock.expectOne(API.ITEM_UNITS.BY_ID(1));
    request.flush({}, { status: 400, statusText: 'Bad Request' });
  });

  it('should delete selected units', () => {
    service.deleteAll([1, 3]).subscribe();
    const request = httpMock.expectOne(API.ITEM_UNITS.DELETE_ALL);
    expect(request.request.method).toBe('DELETE');
    expect(request.request.body).toEqual([1, 3]);
    request.flush(null);
  });

  it('should propagate a batch deletion failure', () => {
    service.deleteAll([1, 3]).subscribe({
      next: () => fail('Expected HTTP error'),
      error: (error: HttpErrorResponse) => expect(error.status).toBe(400),
    });
    const request = httpMock.expectOne(API.ITEM_UNITS.DELETE_ALL);
    request.flush({}, { status: 400, statusText: 'Bad Request' });
  });

  it('should deactivate a unit', () => {
    service.changeActive(1, false).subscribe();
    const request = httpMock.expectOne(API.ITEM_UNITS.CHANGE_ACTIVE(1));
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toBeFalse();
    request.flush(null);
  });

  it('should propagate a rented unit deactivation failure', () => {
    service.changeActive(1, false).subscribe({
      next: () => fail('Expected HTTP error'),
      error: (error: HttpErrorResponse) => expect(error.status).toBe(400),
    });
    const request = httpMock.expectOne(API.ITEM_UNITS.CHANGE_ACTIVE(1));
    request.flush({}, { status: 400, statusText: 'Bad Request' });
  });
});
