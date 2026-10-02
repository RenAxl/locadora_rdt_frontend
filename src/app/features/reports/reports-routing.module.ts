import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'financial-reports',
    pathMatch: 'full',
  },
  {
    path: 'financial-reports',
    loadChildren: () =>
      import('./financial-reports/financial-reports.module').then(
        (m) => m.FinancialReportsModule,
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
