import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeFileDTO } from '../dtos/employee-file-dto';
import { API } from 'src/app/core/config/api.config';

@Injectable({
  providedIn: 'root',
})
export class EmployeeFileService {
  constructor(private http: HttpClient) {}

  findAllByEmployee(employeeId: number): Observable<EmployeeFileDTO[]> {
    return this.http.get<EmployeeFileDTO[]>(API.EMPLOYEES.FILES.ROOT(employeeId));
  }

  getViewBlob(employeeId: number, fileId: number): Observable<Blob> {
    return this.http.get(API.EMPLOYEES.FILES.VIEW(employeeId, fileId), {
      responseType: 'blob',
    });
  }

  upload(
    employeeId: number,
    name: string,
    file: File,
  ): Observable<EmployeeFileDTO> {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);

    return this.http.post<EmployeeFileDTO>(API.EMPLOYEES.FILES.ROOT(employeeId), formData);
  }

  delete(employeeId: number, fileId: number): Observable<void> {
    return this.http.delete<void>(
      API.EMPLOYEES.FILES.BY_ID(employeeId, fileId),
    );
  }

  download(employeeId: number, fileId: number): Observable<HttpResponse<Blob>> {
    return this.http.get(API.EMPLOYEES.FILES.DOWNLOAD(employeeId, fileId), {
      observe: 'response',
      responseType: 'blob',
    });
  }
}
