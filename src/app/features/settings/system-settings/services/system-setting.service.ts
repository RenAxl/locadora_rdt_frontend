import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { SystemSettingDTO } from '../dtos/system-setting-dto';
import { SystemSettingUpdateDTO } from '../dtos/system-setting-update-dto';

@Injectable({
  providedIn: 'root',
})
export class SystemSettingService {
  constructor(private http: HttpClient) {}

  findCurrent(): Observable<SystemSettingDTO> {
    return this.http.get<SystemSettingDTO>(API.SYSTEM_SETTINGS.ROOT);
  }

  update(dto: SystemSettingUpdateDTO): Observable<SystemSettingDTO> {
    return this.http.put<SystemSettingDTO>(API.SYSTEM_SETTINGS.ROOT, dto);
  }
}
