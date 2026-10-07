import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockReportsRoutingModule } from './stock-reports-routing.module';
import { StockReportListComponent } from './pages/stock-report-list/stock-report-list.component';

@NgModule({
  declarations: [StockReportListComponent],
  imports: [CommonModule, FormsModule, StockReportsRoutingModule],
})
export class StockReportsModule {}
