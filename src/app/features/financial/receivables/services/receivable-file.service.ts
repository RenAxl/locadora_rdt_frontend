import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReceivableFileDTO } from '../dtos/receivable-file-dto';
import { API } from 'src/app/core/config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ReceivableFileService {
  constructor(private http: HttpClient) {}

  findAllByReceivable(receivableId: number): Observable<ReceivableFileDTO[]> {
    return this.http.get<ReceivableFileDTO[]>(API.RECEIVABLES.FILES.ROOT(receivableId));
  }

  getViewBlob(receivableId: number, fileId: number): Observable<Blob> {
    return this.http.get(API.RECEIVABLES.FILES.VIEW(receivableId, fileId), {
      responseType: 'blob',
    });
  }

  upload(
    receivableId: number,
    name: string,
    file: File,
  ): Observable<ReceivableFileDTO> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);

    return this.http.post<ReceivableFileDTO>(API.RECEIVABLES.FILES.ROOT(receivableId), formData);
  }

  delete(receivableId: number, fileId: number): Observable<void> {
    return this.http.delete<void>(
      API.RECEIVABLES.FILES.BY_ID(receivableId, fileId),
    );
  }

  download(receivableId: number, fileId: number): Observable<HttpResponse<Blob>> {
    return this.http.get(API.RECEIVABLES.FILES.DOWNLOAD(receivableId, fileId), {
      observe: 'response',
      responseType: 'blob',
    });
  }
}
