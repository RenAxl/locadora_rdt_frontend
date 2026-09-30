import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PaymentFrequencyListComponent } from './pages/payment-frequency-list/payment-frequency-list.component';
import { PaymentFrequencyFormComponent } from './pages/payment-frequency-form/payment-frequency-form.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PaymentFrequencyListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['FREQUENCY_READ'],
    },
  },

  {
    path: 'create',
    component: PaymentFrequencyFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['FREQUENCY_WRITE'],
    },
  },

  {
    path: ':paymentFrequencyId/edit',
    component: PaymentFrequencyFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['FREQUENCY_WRITE'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PaymentFrequenciesRoutingModule {}
