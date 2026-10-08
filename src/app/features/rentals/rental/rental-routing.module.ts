import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RentalListComponent } from './pages/rental-list/rental-list.component';
import { RentalFormComponent } from './pages/rental-form/rental-form.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: RentalListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['RENTAL_READ'],
    },
  },

  {
    path: 'create',
    component: RentalFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['RENTAL_WRITE', 'RENTAL_CUSTOMER'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RentalRoutingModule {}
