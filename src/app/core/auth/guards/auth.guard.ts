import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {

    if (this.auth.isAccessTokenInvalid()) {
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: state.url },
      });
      return false;
    }

    const authorities = route.data['authorities'] as string[] | undefined;

    if (!authorities || authorities.length === 0) {
      return true;
    }

    const allowed = this.auth.hasAnyAuthority(authorities);

    if (!allowed) {
      this.router.navigate(['/not-authorized']);
      return false;
    }

    return true;
  }
}