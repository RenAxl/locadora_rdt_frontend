import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RentalTypeListComponent } from './pages/rental-type-list/rental-type-list.component';
import { RentalTypeFormComponent } from './pages/rental-type-form/rental-type-form.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: RentalTypeListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['RENTAL_TYPES_READ'],
    },
  },

  {
    path: 'create',
    component: RentalTypeFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['RENTAL_TYPES_WRITE'],
    },
  },

  {
    path: ':rentalTypeId/edit',
    component: RentalTypeFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['RENTAL_TYPES_WRITE'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RentalTypesRoutingModule {}
