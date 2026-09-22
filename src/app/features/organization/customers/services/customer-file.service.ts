import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerFileDTO } from '../dtos/customer-file-dto';
import { API } from 'src/app/core/config/api.config';

@Injectable({
  providedIn: 'root',
})
export class CustomerFileService {
  constructor(private http: HttpClient) {}

  findAllByCustomer(customerId: number): Observable<CustomerFileDTO[]> {
    return this.http.get<CustomerFileDTO[]>(API.CUSTOMERS.FILES.ROOT(customerId));
  }

  getViewBlob(customerId: number, fileId: number): Observable<Blob> {
    return this.http.get(API.CUSTOMERS.FILES.VIEW(customerId, fileId), {
      responseType: 'blob',
    });
  }

  upload(
    customerId: number,
    name: string,
    file: File,
  ): Observable<CustomerFileDTO> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);

    return this.http.post<CustomerFileDTO>(API.CUSTOMERS.FILES.ROOT(customerId), formData);
  }

  delete(customerId: number, fileId: number): Observable<void> {
    return this.http.delete<void>(
      API.CUSTOMERS.FILES.BY_ID(customerId, fileId),
    );
  }

  download(customerId: number, fileId: number): Observable<HttpResponse<Blob>> {
    return this.http.get(API.CUSTOMERS.FILES.DOWNLOAD(customerId, fileId), {
      observe: 'response',
      responseType: 'blob',
    });
  }
}
