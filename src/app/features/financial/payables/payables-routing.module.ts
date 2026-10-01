import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PayableListComponent } from './pages/payable-list/payable-list.component';
import { PayableFormComponent } from './pages/payable-form/payable-form.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PayableListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['PAYABLE_READ'],
    },
  },

  {
    path: 'create',
    component: PayableFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['PAYABLE_WRITE'],
    },
  },

  {
    path: ':payableId/edit',
    component: PayableFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['PAYABLE_WRITE'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PayablesRoutingModule {}
