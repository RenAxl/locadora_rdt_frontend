import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemUnitListComponent } from './pages/item-unit-list/item-unit-list.component';
import { ItemUnitFormComponent } from './pages/item-unit-form/item-unit-form.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ItemUnitListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['ITEM_UNIT_READ'],
    },
  },

  {
    path: 'create',
    component: ItemUnitFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['ITEM_UNIT_WRITE'],
    },
  },

  {
    path: ':itemUnitId/edit',
    component: ItemUnitFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['ITEM_UNIT_WRITE'],
    },
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ItemUnitsRoutingModule {}
