import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StockMovementListComponent } from './pages/stock-movement-list/stock-movement-list.component';
import { StockMovementFormComponent } from './pages/stock-movement-form/stock-movement-form.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: StockMovementListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['STOCK_MOVEMENTS_READ'],
    },
  },

  {
    path: 'create',
    component: StockMovementFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['STOCK_MOVEMENTS_WRITE'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StockMovementsRoutingModule {}
