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
import { FieldCustomizationComponent } from './components/field-customization/field-customization.component';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { ExcelExportComponent } from './components/excel-export/excel-export.component';
import { OverlayPanelModule } from 'primeng/overlaypanel';

@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    NameFilterComponent,
    MessageComponent,
    DataTableComponent,
    FieldCustomizationComponent,
    ExcelExportComponent
  ],

  imports: [
    CommonModule,
    FormsModule,
    NgxMaskModule.forRoot(),
    TableModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    OverlayPanelModule,

    RouterModule
    
  ],

  exports:[
    NavbarComponent, 
    SidebarComponent,
    NameFilterComponent,
    MessageComponent,
    DataTableComponent,
    NgxMaskModule,
    FieldCustomizationComponent,
    ExcelExportComponent
  ],
})
export class SharedModule { }
