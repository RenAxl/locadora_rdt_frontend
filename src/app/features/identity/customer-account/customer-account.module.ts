import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomerAccountRoutingModule } from './customer-account-routing.module';
import { CustomerAccountRegisterComponent } from './pages/customer-account-register/customer-account-register.component';
import { CustomerAccountCreatePasswordComponent } from './pages/customer-account-create-password/customer-account-create-password.component';
import { CustomerAccountResendComponent } from './pages/customer-account-resend/customer-account-resend.component';

@NgModule({
  declarations: [
    CustomerAccountRegisterComponent,
    CustomerAccountCreatePasswordComponent,
    CustomerAccountResendComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    SharedModule,
    CustomerAccountRoutingModule,
  ],
})
export class CustomerAccountModule {}
