import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecoveryPasswordRoutingModule } from './recovery-password-routing.module';
import { RequestPasswordResetComponent } from './pages/request-password-reset/request-password-reset.component';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'src/app/shared/shared.module';
import { PasswordResetComponent } from './pages/password-reset/password-reset.component';

@NgModule({
  declarations: [
    RequestPasswordResetComponent,
    PasswordResetComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    SharedModule,

    RecoveryPasswordRoutingModule,
  ],
})
export class RecoveryPasswordModule {}
