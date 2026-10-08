import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaginatorModule } from 'primeng/paginator';

import { RentalHistoryRoutingModule } from './rental-history-routing.module';
import { RentalHistoryListComponent } from './pages/rental-history-list/rental-history-list.component';

@NgModule({
  declarations: [
    RentalHistoryListComponent,
  ],
  imports: [
    CommonModule,
    PaginatorModule,
    RentalHistoryRoutingModule,
  ],
})
export class RentalHistoryModule {}
