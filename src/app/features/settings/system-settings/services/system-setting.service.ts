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
  systemName: string = 'RDT Games';
  systemIcon: string = 'fa-gamepad';

  constructor(private http: HttpClient) {}

  updateSystemName(name?: string): void {
    if (name == null || name.trim() === '') {
      this.systemName = 'RDT Games';
      return;
    }

    this.systemName = name;
  }

  updateSystemIcon(icon?: string): void {
    if (icon == null || icon === '') {
      this.systemIcon = 'fa-gamepad';
      return;
    }

    this.systemIcon = icon;
  }

  findCurrent(): Observable<SystemSettingDTO> {
    return this.http.get<SystemSettingDTO>(API.SYSTEM_SETTINGS.ROOT);
  }

  update(dto: SystemSettingUpdateDTO): Observable<SystemSettingDTO> {
    return this.http.put<SystemSettingDTO>(API.SYSTEM_SETTINGS.ROOT, dto);
  }
}
