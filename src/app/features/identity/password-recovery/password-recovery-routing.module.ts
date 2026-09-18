import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RequestPasswordResetComponent } from './pages/request-password-reset/request-password-reset.component';
import { PasswordResetComponent } from './pages/password-reset/password-reset.component';

const routes: Routes = [
  {
    path: '',
    component: RequestPasswordResetComponent,
  },

   {
    path: 'password-reset',
    component: PasswordResetComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswordRecoveryRoutingModule {}
