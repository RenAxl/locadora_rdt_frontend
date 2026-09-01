import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';

import { PermissionDTO } from '../dtos/permission-dto';

@Injectable({
  providedIn: 'root',
})
export class PermissionService {
  constructor(private http: HttpClient) {}

  list(groupName: string): Observable<PermissionDTO[]> {
    const params = new HttpParams().set('groupName', groupName || '');

    return this.http.get<PermissionDTO[]>(API.PERMISSIONS.ROOT, { params });
  }

  listGroups(): Observable<string[]> {
    return this.http.get<string[]>(API.PERMISSIONS.GROUPS);
  }
}
