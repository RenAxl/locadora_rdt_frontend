import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ActivateAccountService {
  constructor(private http: HttpClient) {}

  activate(token: string, password: string): Observable<void> {
    return this.http.post<void>(
      API.ACTIVATE_ACCOUNT.ACTIVATE,
      { password },
      { params: { token } },
    );
  }
}
