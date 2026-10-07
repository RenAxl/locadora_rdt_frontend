import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CatalogListComponent } from './pages/catalog-list/catalog-list.component';
import { CatalogItemDetailsComponent } from './pages/catalog-item-details/catalog-item-details.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: CatalogListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['CATALOG_READ'],
    },
  },

  {
    path: ':itemId',
    component: CatalogItemDetailsComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['CATALOG_READ'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CatalogRoutingModule {}
