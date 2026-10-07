import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';
import { StockReportListComponent } from './pages/stock-report-list/stock-report-list.component';

const routes: Routes = [{
  path: '', component: StockReportListComponent, canActivate: [AuthGuard],
  data: { authorities: ['STOCK_REPORTS_READ'] },
}];

@NgModule({ imports: [RouterModule.forChild(routes)], exports: [RouterModule] })
export class StockReportsRoutingModule {}
