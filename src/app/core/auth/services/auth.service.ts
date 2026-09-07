import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { JwtHelperService } from '@auth0/angular-jwt';

import { API } from '../../config/api.config';
import { TokenService } from './token.service';
import { environment } from 'src/environments/environment';
import { User } from 'src/app/features/identity/users/models/User';
import { OAuthTokenResponse } from '../models/OAuthTokenResponse';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private decodedToken: any = null;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private jwtHelper: JwtHelperService,
  ) {
    this.loadDecodedTokenFromStorage();
  }

  requestToken(user: User): Observable<OAuthTokenResponse> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: environment.oauthBasicAuth,
    });

    const body = new URLSearchParams({
      username: user.email ?? '',
      password: user.password ?? '',
      grant_type: 'password',
    }).toString();

    return this.http.post<OAuthTokenResponse>(API.AUTH.TOKEN, body, { headers });
  }

  login(user: User): Observable<OAuthTokenResponse> {
    return this.requestToken(user).pipe(
      tap((data) => {
        if (data.access_token) {
          this.tokenService.setToken(data.access_token);
          this.decodedToken = this.jwtHelper.decodeToken(data.access_token);
        }
      }),
    );
  }

  logout(): void {
    this.tokenService.clearToken();
    this.decodedToken = null;
  }

  isAccessTokenInvalid(): boolean {
    const token = this.getToken();
    return !token || this.jwtHelper.isTokenExpired(token);
  }

  hasAuthority(authority: string): boolean {
    if (!authority) {
      return false;
    }

    return this.getAuthorities().includes(authority.trim());
  }

  hasAnyAuthority(authorities: string[]): boolean {
    if (!authorities || authorities.length === 0) {
      return true;
    }

    return authorities.some((authority) => this.hasAuthority(authority));
  }

  hasAllAuthorities(authorities: string[]): boolean {
    if (!authorities || authorities.length === 0) {
      return true;
    }

    return authorities.every((authority) => this.hasAuthority(authority));
  }

  getUsernameFromToken(): string | null {
    return this.decodedToken?.user_name ?? null;
  }

  private getToken(): string | null {
    return this.tokenService.getToken();
  }

  private loadDecodedTokenFromStorage(): void {
    const token = this.getToken();
    if (token) {
      this.decodedToken = this.jwtHelper.decodeToken(token);
    }
  }

  private getAuthorities(): string[] {
    if (!this.decodedToken) {
      this.loadDecodedTokenFromStorage();
    }

    const authorities = this.decodedToken?.authorities;

    if (!Array.isArray(authorities)) {
      return [];
    }

    return authorities.map((authority: string) => authority.trim());
  }
}
