import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RentalReportsRoutingModule } from './rental-reports-routing.module';
import { RentalReportListComponent } from './pages/rental-report-list/rental-report-list.component';

@NgModule({
  declarations: [
    RentalReportListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    RentalReportsRoutingModule,
  ],
})
export class RentalReportsModule {}
