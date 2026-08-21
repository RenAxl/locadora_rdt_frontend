import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ErrorHandlerService } from '../../error/services/error-handler.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private errorHandler: ErrorHandlerService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: unknown) => {
        if (error instanceof HttpErrorResponse) {

          const isUserPhotoEndpoint =
            req.url.includes('/users/me/photo') ||
            /\/users\/\d+\/photo(\?|$)/.test(req.url);

          const isNoPhotoStatus = error.status === 404 || error.status === 204;

          if (isUserPhotoEndpoint && isNoPhotoStatus) {
            return of(null as any);
          }

          this.errorHandler.handle(error);
          return throwError(() => error);
        }

        this.errorHandler.handle('Erro inesperado ao processar a requisição.');
        return throwError(() => error);
      })
    );
  }
}