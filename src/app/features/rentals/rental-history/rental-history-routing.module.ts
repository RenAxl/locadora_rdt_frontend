import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RentalHistoryListComponent } from './pages/rental-history-list/rental-history-list.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: RentalHistoryListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['RENTAL_HISTORY_READ'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RentalHistoryRoutingModule {}
