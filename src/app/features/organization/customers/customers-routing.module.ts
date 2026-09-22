import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerListComponent } from './pages/customer-list/customer-list.component';
import { CustomerFormComponent } from './pages/customer-form/customer-form.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: CustomerListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['CUSTOMER_READ'],
    },
  },

  {
    path: 'create',
    component: CustomerFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['CUSTOMER_WRITE'],
    },
  },

  {
    path: ':customerId/edit',
    component: CustomerFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['CUSTOMER_WRITE'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomersRoutingModule {}
