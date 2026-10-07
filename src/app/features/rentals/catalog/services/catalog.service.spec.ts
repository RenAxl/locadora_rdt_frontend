import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { CatalogService } from './catalog.service';

describe('CatalogService', () => {
  let service: CatalogService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(CatalogService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should send pagination, name and category to the catalog endpoint', () => {
    const pagination = new Pagination(2, 10, 'DESC', 'price');

    service.list(pagination, 'Furadeira', 4).subscribe();

    const request = http.expectOne((req) => req.url === API.BASE + '/catalog');

    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('linesPerPage')).toBe('10');
    expect(request.request.params.get('direction')).toBe('DESC');
    expect(request.request.params.get('orderBy')).toBe('price');
    expect(request.request.params.get('name')).toBe('Furadeira');
    expect(request.request.params.get('categoryId')).toBe('4');

    request.flush({ content: [], totalElements: 0 });
  });

  it('should omit the category parameter when all categories are selected', () => {
    service.list(new Pagination(0, 10), '', null).subscribe();

    const request = http.expectOne((req) => req.url === API.BASE + '/catalog');

    expect(request.request.params.has('categoryId')).toBeFalse();

    request.flush({ content: [], totalElements: 0 });
  });

  it('should read the item details from the catalog endpoint', () => {
    service.findById(1).subscribe((item) => {
      expect(item.id).toBe(1);
      expect(item.price).toBe(25);
      expect(item.description).toBe('Furadeira elétrica');
    });

    const request = http.expectOne(API.BASE + '/catalog/1');

    expect(request.request.method).toBe('GET');

    request.flush({ id: 1, price: 25, description: 'Furadeira elétrica' });
  });

  it('should request the item image as a blob', () => {
    service.getItemImage(1).subscribe();

    const request = http.expectOne(API.BASE + '/catalog/1/image');

    expect(request.request.method).toBe('GET');
    expect(request.request.responseType).toBe('blob');

    request.flush(new Blob());
  });
});
