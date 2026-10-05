import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockBalanceListComponent } from './pages/stock-balance-list/stock-balance-list.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: StockBalanceListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['STOCK_BALANCES_READ'],
    },
  },

  {
    path: ':itemId/units',
    loadChildren: () =>
      import('../item-units/item-units.module').then((m) => m.ItemUnitsModule),
    canActivate: [AuthGuard],
    data: {
      authorities: ['STOCK_BALANCES_READ'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockBalancesRoutingModule {}
