import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ErrorHandlerService } from './error/services/error-handler.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './http/interceptors/error.interceptor';
import { JwtModule } from '@auth0/angular-jwt';
import { tokenGetter } from './auth/utils/token-getter';
import { API } from './config/api.config';

@NgModule({
  imports: [
    CommonModule,
    ToastModule,
    ConfirmDialogModule,

    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: ['localhost:8080'],
        disallowedRoutes: [API.AUTH.TOKEN],
      },
    }),
  ],

  exports: [ToastModule, ConfirmDialogModule],

  declarations: [PageNotFoundComponent],

  providers: [
    MessageService,
    ConfirmationService,
    ErrorHandlerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule já foi carregado. Importe o CoreModule apenas no AppModule.',
      );
    }
  }
}
