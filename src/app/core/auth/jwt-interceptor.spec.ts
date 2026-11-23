import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CoreModule } from '../core.module';
import { API } from '../config/api.config';
import { ErrorHandlerService } from '../error/services/error-handler.service';
import { TOKEN_KEY } from './constants/token.constants';

describe('JWT authentication for the configured API', () => {
  const token = 'diagnostic-test-token';
  let http: HttpClient;
  let requests: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CoreModule],
      providers: [{ provide: ErrorHandlerService, useValue: { handle: () => {} } }],
    });
    http = TestBed.inject(HttpClient);
    requests = TestBed.inject(HttpTestingController);
    localStorage.setItem(TOKEN_KEY, token);
  });

  afterEach(() => {
    requests.verify();
    localStorage.removeItem(TOKEN_KEY);
  });

  [
    '/system-settings',
    '/suppliers?name=&page=0&linesPerPage=1000',
    '/employees?name=&page=0&linesPerPage=1000',
    '/payment-methods?name=&page=0&linesPerPage=1000',
    '/payment-frequencies?frequency=&page=0&linesPerPage=1000',
    '/payables?search=&page=0&linesPerPage=10',
  ].forEach((path) => {
    it(`sends the stored Bearer token to ${path}`, () => {
      const url = `${API.BASE}${path}`;
      http.get(url).subscribe();

      const request = requests.expectOne(url);
      expect(request.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
      request.flush({});
    });
  });

  it('preserves Basic authentication when requesting a login token', () => {
    const basic = 'Basic diagnostic-test-client';
    http.post(API.AUTH.TOKEN, 'grant_type=password', {
      headers: new HttpHeaders({ Authorization: basic }),
    }).subscribe();

    const request = requests.expectOne(API.AUTH.TOKEN);
    expect(request.request.headers.get('Authorization')).toBe(basic);
    request.flush({});
  });

  [
    API.CUSTOMER_ACCOUNT.REGISTER,
    API.CUSTOMER_ACCOUNT.CREATE_PASSWORD,
    API.CUSTOMER_ACCOUNT.RESEND_ACTIVATION,
  ].forEach((url) => {
    it(`does not attach the stored token to the public route ${new URL(url).pathname}`, () => {
      http.post(url, {}).subscribe();

      const request = requests.expectOne(url);
      expect(request.request.headers.has('Authorization')).toBeFalse();
      request.flush({});
    });
  });

  it('does not send a token when the session has no stored token', () => {
    localStorage.removeItem(TOKEN_KEY);
    const url = `${API.BASE}/system-settings`;
    http.get(url).subscribe();

    const request = requests.expectOne(url);
    expect(request.request.headers.has('Authorization')).toBeFalse();
    request.flush({});
  });

  [
    'https://untrusted.example/system-settings',
    `https://${new URL(API.BASE).hostname}.untrusted.example/system-settings`,
  ].forEach((url) => {
    it(`does not leak the token to ${new URL(url).hostname}`, () => {
      http.get(url).subscribe();

      const request = requests.expectOne(url);
      expect(request.request.headers.has('Authorization')).toBeFalse();
      request.flush({});
    });
  });
});
