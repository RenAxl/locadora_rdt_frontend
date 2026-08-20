import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MainComponent } from './main/main.component';
import { AuthComponent } from './auth/auth.component';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    MainComponent,
    AuthComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule   
  ],
  exports: [
    MainComponent,
    AuthComponent,
  ],
})
export class ShellModule {}
