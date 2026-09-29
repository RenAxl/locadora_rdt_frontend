import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';

import { EmployeesRoutingModule } from './employees-routing.module';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { EmployeeFormComponent } from './pages/employee-form/employee-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { EmployeeDetailsModalComponent } from './components/employee-details-modal/employee-details-modal.component';
import { EmployeeFilesModalComponent } from './components/employee-files-modal/employee-files-modal.component';

@NgModule({
  declarations: [
    EmployeeListComponent,
    EmployeeFormComponent,
    EmployeeDetailsModalComponent,
    EmployeeFilesModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    InputNumberModule,
    SharedModule,
    EmployeesRoutingModule,
  ],
})
export class EmployeesModule {}
