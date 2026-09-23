import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerAccountRegisterComponent } from './pages/customer-account-register/customer-account-register.component';
import { CustomerAccountCreatePasswordComponent } from './pages/customer-account-create-password/customer-account-create-password.component';
import { CustomerAccountResendComponent } from './pages/customer-account-resend/customer-account-resend.component';

const routes: Routes = [
  {
    path: 'register',
    component: CustomerAccountRegisterComponent,
  },

  {
    path: 'create-password',
    component: CustomerAccountCreatePasswordComponent,
  },

  {
    path: 'resend',
    component: CustomerAccountResendComponent,
  },

  {
    path: '',
    redirectTo: 'register',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerAccountRoutingModule {}
