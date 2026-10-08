import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { PaginatorModule } from 'primeng/paginator';

import { RentalRoutingModule } from './rental-routing.module';
import { RentalListComponent } from './pages/rental-list/rental-list.component';
import { RentalFormComponent } from './pages/rental-form/rental-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RentalDetailsModalComponent } from './components/rental-details-modal/rental-details-modal.component';
import { RentalCardComponent } from './components/rental-card/rental-card.component';
import { RentalOverdueModalComponent } from './components/rental-overdue-modal/rental-overdue-modal.component';
import { RentalCheckoutModalComponent } from './components/rental-checkout-modal/rental-checkout-modal.component';

@NgModule({
  declarations: [
    RentalListComponent,
    RentalFormComponent,
    RentalDetailsModalComponent,
    RentalCardComponent,
    RentalOverdueModalComponent,
    RentalCheckoutModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    PaginatorModule,
    SharedModule,
    RentalRoutingModule,
  ],
})
export class RentalModule {}
