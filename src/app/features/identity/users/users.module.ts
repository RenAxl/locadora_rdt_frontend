import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';

import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserFormComponent } from './pages/user-form/user-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserDetailsModalComponent } from './components/user-details-modal/user-details-modal.component';



@NgModule({
  declarations: [
    UserListComponent,
    UserFormComponent,
    UserDetailsModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    MultiSelectModule,
    SharedModule,
    UsersRoutingModule
  ]
})
export class UsersModule { }
