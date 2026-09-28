import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SupplierFileDTO } from '../dtos/supplier-file-dto';
import { API } from 'src/app/core/config/api.config';

@Injectable({
  providedIn: 'root',
})
export class SupplierFileService {
  constructor(private http: HttpClient) {}

  findAllBySupplier(supplierId: number): Observable<SupplierFileDTO[]> {
    return this.http.get<SupplierFileDTO[]>(
      API.SUPPLIERS.FILES.ROOT(supplierId),
    );
  }

  getViewBlob(supplierId: number, fileId: number): Observable<Blob> {
    return this.http.get(API.SUPPLIERS.FILES.VIEW(supplierId, fileId), {
      responseType: 'blob',
    });
  }

  upload(
    supplierId: number,
    name: string,
    file: File,
  ): Observable<SupplierFileDTO> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);

    return this.http.post<SupplierFileDTO>(
      API.SUPPLIERS.FILES.ROOT(supplierId),
      formData,
    );
  }

  delete(supplierId: number, fileId: number): Observable<void> {
    return this.http.delete<void>(
      API.SUPPLIERS.FILES.BY_ID(supplierId, fileId),
    );
  }

  download(supplierId: number, fileId: number): Observable<HttpResponse<Blob>> {
    return this.http.get(API.SUPPLIERS.FILES.DOWNLOAD(supplierId, fileId), {
      observe: 'response',
      responseType: 'blob',
    });
  }
}
