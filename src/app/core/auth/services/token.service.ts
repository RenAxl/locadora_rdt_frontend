import { Injectable } from '@angular/core';
import { TOKEN_KEY } from '../constants/token.constants';
import { tokenGetter } from '../utils/token-getter';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  
  getToken(): string | null {
    return tokenGetter();
  }

  setToken(token: string): void {
    localStorage.setItem(TOKEN_KEY, token);
  }

  clearToken(): void {
    localStorage.removeItem(TOKEN_KEY);
  }
}
