import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { FinancialReportsRoutingModule } from './financial-reports-routing.module';
import { FinancialReportListComponent } from './pages/financial-report-list/financial-report-list.component';

@NgModule({
  declarations: [
    FinancialReportListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    FinancialReportsRoutingModule,
  ],
})
export class FinancialReportsModule {}
