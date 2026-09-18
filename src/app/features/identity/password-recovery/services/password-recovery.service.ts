import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { API } from 'src/app/core/config/api.config';

@Injectable({
  providedIn: 'root',
})
export class PasswordRecoveryService {
  constructor(private http: HttpClient) {}

  recoveryPassword(email: string): Observable<void> {
    const payload = {
      email: email.trim(),
    };

    return this.http.post<void>(API.RECOVERY_PASSWORD.REQUEST_PASSWORD_RESET, payload);
  }

  resetPassword(token: string, password: string): Observable<void> {
    const payload = {
      password: password.trim(),
    };

    const url = API.RECOVERY_PASSWORD.PASSWORD_RESET + '?token=' + token;

    return this.http.post<void>(url, payload);
  }
}
