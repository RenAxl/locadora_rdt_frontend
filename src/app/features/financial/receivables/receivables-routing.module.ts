import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReceivableListComponent } from './pages/receivable-list/receivable-list.component';
import { ReceivableFormComponent } from './pages/receivable-form/receivable-form.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ReceivableListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['RECEIVABLE_READ'],
    },
  },

  {
    path: 'create',
    component: ReceivableFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['RECEIVABLE_WRITE'],
    },
  },

  {
    path: ':receivableId/edit',
    component: ReceivableFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['RECEIVABLE_WRITE'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReceivablesRoutingModule {}
