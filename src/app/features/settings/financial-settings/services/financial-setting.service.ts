import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';

import { FinancialSettingDTO } from '../dtos/financial-setting-dto';
import { FinancialSettingUpdateDTO } from '../dtos/financial-setting-update-dto';

@Injectable({
  providedIn: 'root',
})
export class FinancialSettingService {
  constructor(private http: HttpClient) {}

  findCurrent(): Observable<FinancialSettingDTO> {
    return this.http.get<FinancialSettingDTO>(API.FINANCIAL_SETTINGS.ROOT);
  }

  update(dto: FinancialSettingUpdateDTO): Observable<FinancialSettingDTO> {
    return this.http.put<FinancialSettingDTO>(API.FINANCIAL_SETTINGS.ROOT, dto);
  }
}
