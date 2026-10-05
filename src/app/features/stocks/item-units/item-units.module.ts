import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';

import { ItemUnitsRoutingModule } from './item-units-routing.module';
import { ItemUnitListComponent } from './pages/item-unit-list/item-unit-list.component';
import { ItemUnitFormComponent } from './pages/item-unit-form/item-unit-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ItemUnitDetailsModalComponent } from './components/item-unit-details-modal/item-unit-details-modal.component';

@NgModule({
  declarations: [
    ItemUnitListComponent,
    ItemUnitFormComponent,
    ItemUnitDetailsModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    SharedModule,
    ItemUnitsRoutingModule,
  ],
})
export class ItemUnitsModule {}
