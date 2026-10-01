import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentMethodListComponent } from './pages/payment-method-list/payment-method-list.component';
import { PaymentMethodFormComponent } from './pages/payment-method-form/payment-method-form.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PaymentMethodListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['METHODS_READ'],
    },
  },

  {
    path: 'create',
    component: PaymentMethodFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['METHODS_WRITE'],
    },
  },

  {
    path: ':paymentMethodId/edit',
    component: PaymentMethodFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['METHODS_WRITE'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentMethodsRoutingModule {}
