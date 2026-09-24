import { DialogModule } from 'primeng/dialog';
import { DepartmentDetailsModalComponent } from './components/department-details-modal/department-details-modal.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

import { DepartmentsRoutingModule } from './departments-routing.module';
import { DepartmentListComponent } from './pages/department-list/department-list.component';
import { DepartmentFormComponent } from './pages/department-form/department-form.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    DepartmentDetailsModalComponent,
    DepartmentListComponent,
    DepartmentFormComponent,
  ],
  imports: [
    DialogModule,
    CommonModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    SharedModule,

    DepartmentsRoutingModule,
  ],
})
export class DepartmentsModule {}
