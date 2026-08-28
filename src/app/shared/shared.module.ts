import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NameFilterComponent } from './components/name-filter/name-filter.component';
import { MessageComponent } from './components/message/message.component';
import { NgxMaskModule } from 'ngx-mask';
import { TableModule } from 'primeng/table';
import { DataTableComponent } from './components/data-table/data-table.component';
import { TableColumnsModalComponent } from './components/table-columns-modal/table-columns-modal.component';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';

@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    NameFilterComponent,
    MessageComponent,
    DataTableComponent,
    TableColumnsModalComponent
  ],

  imports: [
    CommonModule,
    FormsModule,
    NgxMaskModule.forRoot(),
    TableModule,
    ButtonModule,
    TooltipModule,
    DialogModule,

    RouterModule
    
  ],

  exports:[
    NavbarComponent, 
    SidebarComponent,
    NameFilterComponent,
    MessageComponent,
    DataTableComponent,
    NgxMaskModule,
    TableColumnsModalComponent
  ],
})
export class SharedModule { }
