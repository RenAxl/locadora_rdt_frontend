import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SupplierListComponent } from './pages/supplier-list/supplier-list.component';
import { SupplierFormComponent } from './pages/supplier-form/supplier-form.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: SupplierListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['SUPPLIER_READ'],
    },
  },

  {
    path: 'create',
    component: SupplierFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['SUPPLIER_WRITE'],
    },
  },

  {
    path: ':supplierId/edit',
    component: SupplierFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['SUPPLIER_WRITE'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SuppliersRoutingModule {}
