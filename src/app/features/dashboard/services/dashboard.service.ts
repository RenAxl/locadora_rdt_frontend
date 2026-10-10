import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { DashboardDTO } from '../dtos/dashboard-dto';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private http: HttpClient) {}

  getSummary(): Observable<DashboardDTO> {
    return this.http.get<DashboardDTO>(`${API.BASE}/dashboard`);
  }
}
