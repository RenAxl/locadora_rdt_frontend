import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let auth: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let messages: jasmine.SpyObj<MessageService>;
  let route: ActivatedRouteSnapshot;
  let state: RouterStateSnapshot;

  beforeEach(() => {
    auth = jasmine.createSpyObj('AuthService', ['isAccessTokenInvalid', 'hasAnyAuthority']);
    router = jasmine.createSpyObj('Router', ['navigate']);
    messages = jasmine.createSpyObj('MessageService', ['add']);
    guard = new AuthGuard(auth, router, messages);
    route = new ActivatedRouteSnapshot();
    route.data = { authorities: ['CUSTOMER_READ'] };
    state = { url: '/customers' } as RouterStateSnapshot;
    auth.isAccessTokenInvalid.and.returnValue(false);
  });

  it('redirects an expired session to login and preserves the destination', () => {
    auth.isAccessTokenInvalid.and.returnValue(true);

    expect(guard.canActivate(route, state)).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { returnUrl: '/customers' },
    });
    expect(auth.hasAnyAuthority).not.toHaveBeenCalled();
  });

  it('denies access with a message and redirects to the existing home route', () => {
    auth.hasAnyAuthority.and.returnValue(false);

    expect(guard.canActivate(route, state)).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
    expect(messages.add).toHaveBeenCalledWith({
      severity: 'warn',
      detail: 'Você não tem permissão para acessar esta página.',
    });
  });

  it('allows access when the required permission is present', () => {
    auth.hasAnyAuthority.and.returnValue(true);

    expect(guard.canActivate(route, state)).toBeTrue();
    expect(auth.hasAnyAuthority).toHaveBeenCalledWith(['CUSTOMER_READ']);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('allows an authenticated session when no permission is required', () => {
    route.data = {};

    expect(guard.canActivate(route, state)).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
