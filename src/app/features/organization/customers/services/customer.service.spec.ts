import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { API } from 'src/app/core/config/api.config';
import { Pagination } from 'src/app/core/models/Pagination';
import { CustomerUpdateDTO } from '../dtos/customer-update-dto';
import { CustomerService } from './customer.service';
import { CustomerFileService } from './customer-file.service';

describe('Customer services', () => {
  let service: CustomerService;
  let fileService: CustomerFileService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(CustomerService);
    fileService = TestBed.inject(CustomerFileService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('sends the filter, page size and sorting to the customer endpoint', () => {
    const pagination = new Pagination(2, 10, 'DESC', 'name');

    service.list(pagination, 'Maria').subscribe();

    const request = http.expectOne((item) => item.url === API.CUSTOMERS.ROOT);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('name')).toBe('Maria');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('linesPerPage')).toBe('10');
    expect(request.request.params.get('direction')).toBe('DESC');
    expect(request.request.params.get('orderBy')).toBe('name');
    request.flush({ content: [], totalElements: 0 });
  });

  it('keeps CPF, address and inactive status in the update request', () => {
    const dto = new CustomerUpdateDTO();
    dto.id = 1;
    dto.cpf = '12345678901';
    dto.active = false;
    dto.address.city = 'Recife';

    service.update(dto).subscribe();

    const request = http.expectOne(API.CUSTOMERS.BY_ID(1));
    expect(request.request.method).toBe('PUT');
    expect(request.request.body.cpf).toBe('12345678901');
    expect(request.request.body.active).toBeFalse();
    expect(request.request.body.address.city).toBe('Recife');
    request.flush({ id: 1 });
  });

  it('sends the selected IDs in the bulk delete body', () => {
    service.deleteAll([1, 3]).subscribe();

    const request = http.expectOne(API.CUSTOMERS.DELETE_ALL);
    expect(request.request.method).toBe('DELETE');
    expect(request.request.body).toEqual([1, 3]);
    request.flush(null);
  });

  it('uploads the photo using multipart data', () => {
    const file = new File(['photo'], 'photo.png', { type: 'image/png' });

    service.updatePhoto(1, file).subscribe();

    const request = http.expectOne(API.CUSTOMERS.PHOTO(1));
    expect(request.request.method).toBe('PUT');
    expect(request.request.body.get('file')).toBe(file);
    request.flush(null);
  });

  it('returns attachment DTOs with the original filename from the backend', () => {
    fileService.findAllByCustomer(1).subscribe((files) => {
      expect(files[0].originalFileName).toBe('contrato.pdf');
      expect(files[0].customerId).toBe(1);
    });

    const request = http.expectOne(API.CUSTOMERS.FILES.ROOT(1));
    request.flush([{ id: 2, name: 'Contrato', originalFileName: 'contrato.pdf', customerId: 1 }]);
  });

  it('uploads an attachment with its name and file', () => {
    const file = new File(['contract'], 'contrato.pdf', { type: 'application/pdf' });

    fileService.upload(1, 'Contrato', file).subscribe();

    const request = http.expectOne(API.CUSTOMERS.FILES.ROOT(1));
    expect(request.request.method).toBe('POST');
    expect(request.request.body.get('name')).toBe('Contrato');
    expect(request.request.body.get('file')).toBe(file);
    request.flush({ id: 2 });
  });

  it('keeps download headers and binary content', () => {
    const blob = new Blob(['contract'], { type: 'application/pdf' });

    fileService.download(1, 2).subscribe((response) => {
      expect(response.body).toBe(blob);
      expect(response.headers.get('content-disposition')).toBe('attachment; filename="contrato.pdf"');
    });

    const request = http.expectOne(API.CUSTOMERS.FILES.DOWNLOAD(1, 2));
    expect(request.request.responseType).toBe('blob');
    request.flush(blob, { headers: { 'content-disposition': 'attachment; filename="contrato.pdf"' } });
  });
});
