import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardSummaryComponent } from './pages/dashboard-summary/dashboard-summary.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardSummaryComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['DASHBOARD_READ'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
