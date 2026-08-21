import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ErrorHandlerService } from './error/services/error-handler.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './http/interceptors/error.interceptor';

@NgModule({
  imports: [
    CommonModule,
    ToastModule,
    ConfirmDialogModule
  ],

  exports: [
    ToastModule,
    ConfirmDialogModule,
  ],

  declarations: [
    PageNotFoundComponent
  ],

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
        'CoreModule já foi carregado. Importe o CoreModule apenas no AppModule.'
      );
    }
  }
}
