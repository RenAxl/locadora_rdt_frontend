import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { PositionUpdateDTO } from '../dtos/position-update-dto';
import { PositionService } from './position.service';

describe('Position service', () => {
  let service: PositionService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(PositionService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('sends the filter, page size and sorting to the position endpoint', () => {
    const pagination = new Pagination(2, 10, 'DESC', 'name');

    service.list(pagination, 'Motorista').subscribe();

    const request = http.expectOne((item) => item.url === API.POSITIONS.ROOT);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('name')).toBe('Motorista');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('linesPerPage')).toBe('10');
    expect(request.request.params.get('direction')).toBe('DESC');
    expect(request.request.params.get('orderBy')).toBe('name');
    request.flush({ content: [], totalElements: 0 });
  });

  it('uses the DTO ID to update a position', () => {
    const dto = new PositionUpdateDTO({ id: 1, name: 'Motorista' });
    service.update(dto).subscribe();

    const request = http.expectOne(API.POSITIONS.BY_ID(1));
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toBe(dto);
    request.flush({ id: 1, name: 'Motorista' });
  });

  it('does not update without an ID', () => {
    expect(() => service.update(new PositionUpdateDTO()))
      .toThrowError('Position ID is required for update');
    http.expectNone((item) => item.method === 'PUT');
  });

  it('deletes a position using its individual endpoint', () => {
    service.delete(1).subscribe();

    const request = http.expectOne(API.POSITIONS.BY_ID(1));
    expect(request.request.method).toBe('DELETE');
    request.flush(null);
  });
});
