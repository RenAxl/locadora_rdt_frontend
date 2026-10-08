import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';

import { RentalTypesRoutingModule } from './rental-types-routing.module';
import { RentalTypeListComponent } from './pages/rental-type-list/rental-type-list.component';
import { RentalTypeFormComponent } from './pages/rental-type-form/rental-type-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RentalTypeDetailsModalComponent } from './components/rental-type-details-modal/rental-type-details-modal.component';

@NgModule({
  declarations: [
    RentalTypeListComponent,
    RentalTypeFormComponent,
    RentalTypeDetailsModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    SharedModule,
    RentalTypesRoutingModule,
  ],
})
export class RentalTypesModule {}
