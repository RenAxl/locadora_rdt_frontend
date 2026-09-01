import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { InputTextModule } from 'primeng/inputtext';

import { RolesRoutingModule } from './roles-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { RolePermissionsModalComponent } from './components/role-permissions-modal/role-permissions-modal.component';
import { RoleListComponent } from './pages/role-list/role-list.component';
import { RoleFormComponent } from './pages/role-form/role-form.component';



@NgModule({
  declarations: [
    RoleListComponent,
    RoleFormComponent,
    RolePermissionsModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    DropdownModule,
    CheckboxModule,
    ProgressSpinnerModule,
    InputTextModule,
    SharedModule,
    RolesRoutingModule
  ]
})
export class RolesModule { }
