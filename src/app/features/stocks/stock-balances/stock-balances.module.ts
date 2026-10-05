import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { StockBalancesRoutingModule } from './stock-balances-routing.module';
import { StockBalanceListComponent } from './pages/stock-balance-list/stock-balance-list.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [StockBalanceListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    SharedModule,
    StockBalancesRoutingModule,
  ],
})
export class StockBalancesModule {}
