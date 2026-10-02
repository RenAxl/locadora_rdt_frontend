import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancialReportListComponent } from './pages/financial-report-list/financial-report-list.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: FinancialReportListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['FINANCIAL_REPORTS_READ'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialReportsRoutingModule {}
