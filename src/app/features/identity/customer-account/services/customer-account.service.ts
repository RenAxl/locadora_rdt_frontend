import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { CustomerAccountRegistrationDTO } from '../dtos/customer-account-registration-dto';
import { CustomerAccountPasswordDTO } from '../dtos/customer-account-password-dto';
import { CustomerAccountResendDTO } from '../dtos/customer-account-resend-dto';

@Injectable({
  providedIn: 'root',
})
export class CustomerAccountService {
  constructor(private http: HttpClient) {}

  register(dto: CustomerAccountRegistrationDTO): Observable<void> {
    return this.http.post<void>(API.CUSTOMER_ACCOUNT.REGISTER, dto);
  }

  createPassword(
    token: string,
    dto: CustomerAccountPasswordDTO,
  ): Observable<void> {
    const params = new HttpParams().set('token', token);

    return this.http.post<void>(API.CUSTOMER_ACCOUNT.CREATE_PASSWORD, dto, {
      params,
    });
  }

  resendActivation(dto: CustomerAccountResendDTO): Observable<void> {
    return this.http.post<void>(API.CUSTOMER_ACCOUNT.RESEND_ACTIVATION, dto);
  }
}
