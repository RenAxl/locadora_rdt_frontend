import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PayableFileDTO } from '../dtos/payable-file-dto';
import { API } from 'src/app/core/config/api.config';

@Injectable({
  providedIn: 'root',
})
export class PayableFileService {
  constructor(private http: HttpClient) {}

  findAllByPayable(payableId: number): Observable<PayableFileDTO[]> {
    return this.http.get<PayableFileDTO[]>(API.PAYABLES.FILES.ROOT(payableId));
  }

  getViewBlob(payableId: number, fileId: number): Observable<Blob> {
    return this.http.get(API.PAYABLES.FILES.VIEW(payableId, fileId), {
      responseType: 'blob',
    });
  }

  upload(
    payableId: number,
    name: string,
    file: File,
  ): Observable<PayableFileDTO> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);

    return this.http.post<PayableFileDTO>(API.PAYABLES.FILES.ROOT(payableId), formData);
  }

  delete(payableId: number, fileId: number): Observable<void> {
    return this.http.delete<void>(
      API.PAYABLES.FILES.BY_ID(payableId, fileId),
    );
  }

  download(payableId: number, fileId: number): Observable<HttpResponse<Blob>> {
    return this.http.get(API.PAYABLES.FILES.DOWNLOAD(payableId, fileId), {
      observe: 'response',
      responseType: 'blob',
    });
  }
}
