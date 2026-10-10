import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardSummaryComponent } from './pages/dashboard-summary/dashboard-summary.component';

@NgModule({
  declarations: [
    DashboardSummaryComponent,
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
  ],
})
export class DashboardModule {}
