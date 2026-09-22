import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomerListComponent } from './pages/customer-list/customer-list.component';
import { CustomerFormComponent } from './pages/customer-form/customer-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { CustomerDetailsModalComponent } from './components/customer-details-modal/customer-details-modal.component';
import { CustomerFilesModalComponent } from './components/customer-files-modal/customer-files-modal.component';

@NgModule({
  declarations: [
    CustomerListComponent,
    CustomerFormComponent,
    CustomerDetailsModalComponent,
    CustomerFilesModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    SharedModule,
    CustomersRoutingModule,
  ],
})
export class CustomersModule {}
