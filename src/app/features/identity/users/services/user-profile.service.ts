import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { ChangePasswordDTO } from '../dtos/change-password-dto';
import { UserDTO } from '../dtos/user-dto';
import { UserMeUpdateDTO } from '../dtos/user-me-update-dto';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  constructor(private http: HttpClient) {}

  getMe(): Observable<UserDTO> {
    return this.http.get<UserDTO>(API.USER_PROFILE.ME);
  }

  updateMe(dto: UserMeUpdateDTO): Observable<UserDTO> {
    return this.http.put<UserDTO>(API.USER_PROFILE.ME, dto);
  }

  changePassword(dto: ChangePasswordDTO): Observable<void> {
    return this.http.put<void>(API.USER_PROFILE.PASSWORD, dto);
  }

  getMyPhoto(): Observable<Blob> {
    return this.http.get(API.USER_PROFILE.PHOTO, {
      responseType: 'blob',
    });
  }

  updateMyPhoto(file: File): Observable<void> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put<void>(API.USER_PROFILE.PHOTO, formData);
  }
}
