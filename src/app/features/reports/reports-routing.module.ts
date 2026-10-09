import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'rental-reports',
    loadChildren: () =>
      import('./rental-reports/rental-reports.module').then(
        (m) => m.RentalReportsModule,
      ),
  },
  {
    path: 'stock-reports',
    loadChildren: () => import('./stock-reports/stock-reports.module').then(m => m.StockReportsModule),
  },
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
