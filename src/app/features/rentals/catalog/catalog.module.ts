import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';

import { CatalogRoutingModule } from './catalog-routing.module';
import { CatalogListComponent } from './pages/catalog-list/catalog-list.component';
import { CatalogItemDetailsComponent } from './pages/catalog-item-details/catalog-item-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CatalogFilterComponent } from './components/catalog-filter/catalog-filter.component';
import { CatalogItemCardComponent } from './components/catalog-item-card/catalog-item-card.component';
import { CartItemsComponent } from './components/cart-items/cart-items.component';

@NgModule({
  declarations: [
    CatalogListComponent,
    CatalogItemDetailsComponent,
    CatalogItemCardComponent,
    CatalogFilterComponent,
    CartItemsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    PaginatorModule,
    DialogModule,
    SharedModule,
    CatalogRoutingModule,
  ],
})
export class CatalogModule {}
