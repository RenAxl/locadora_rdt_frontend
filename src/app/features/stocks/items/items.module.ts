import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';

import { ItemsRoutingModule } from './items-routing.module';
import { ItemListComponent } from './pages/item-list/item-list.component';
import { ItemFormComponent } from './pages/item-form/item-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ItemDetailsModalComponent } from './components/item-details-modal/item-details-modal.component';
import { ItemUnitListComponent } from './pages/item-unit-list/item-unit-list.component';

@NgModule({
  declarations: [
    ItemListComponent,
    ItemFormComponent,
    ItemDetailsModalComponent,
    ItemUnitListComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    InputNumberModule,
    SharedModule,
    ItemsRoutingModule,
  ],
})
export class ItemsModule {}
