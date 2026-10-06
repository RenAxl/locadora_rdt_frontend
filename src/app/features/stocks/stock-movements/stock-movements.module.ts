import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { StockMovementsRoutingModule } from './stock-movements-routing.module';
import { StockMovementListComponent } from './pages/stock-movement-list/stock-movement-list.component';
import { StockMovementFormComponent } from './pages/stock-movement-form/stock-movement-form.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    StockMovementListComponent,
    StockMovementFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    SharedModule,
    StockMovementsRoutingModule,
  ],
})
export class StockMovementsModule {}
