import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent
  ],

  imports: [
    CommonModule,
    FormsModule,

    RouterModule
    
  ],

  exports:[
    NavbarComponent, 
    SidebarComponent
  ],
})
export class SharedModule { }
