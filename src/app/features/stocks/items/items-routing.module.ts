import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemListComponent } from './pages/item-list/item-list.component';
import { ItemFormComponent } from './pages/item-form/item-form.component';
import { ItemUnitListComponent } from './pages/item-unit-list/item-unit-list.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ItemListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['ITEM_READ'],
    },
  },

  {
    path: 'create',
    component: ItemFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['ITEM_WRITE'],
    },
  },

  {
    path: ':itemId/edit',
    component: ItemFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['ITEM_WRITE'],
    },
  },

  {
    path: 'stock-balances/:itemId/units',
    component: ItemUnitListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['STOCKBALANCES_READ'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemsRoutingModule {}
