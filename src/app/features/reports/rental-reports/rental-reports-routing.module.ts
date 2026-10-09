import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RentalReportListComponent } from './pages/rental-report-list/rental-report-list.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: RentalReportListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['RENTAL_REPORTS_READ'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RentalReportsRoutingModule {}
