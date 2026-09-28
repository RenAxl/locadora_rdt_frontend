import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';

import { SuppliersRoutingModule } from './suppliers-routing.module';
import { SupplierListComponent } from './pages/supplier-list/supplier-list.component';
import { SupplierFormComponent } from './pages/supplier-form/supplier-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SupplierDetailsModalComponent } from './components/supplier-details-modal/supplier-details-modal.component';
import { SupplierFilesModalComponent } from './components/supplier-files-modal/supplier-files-modal.component';

@NgModule({
  declarations: [
    SupplierListComponent,
    SupplierFormComponent,
    SupplierDetailsModalComponent,
    SupplierFilesModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    SharedModule,
    SuppliersRoutingModule,
  ],
})
export class SuppliersModule {}
