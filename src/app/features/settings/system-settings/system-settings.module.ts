import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { SystemSettingsRoutingModule } from './system-settings-routing.module';
import { SystemSettingFormComponent } from './pages/system-setting-form/system-setting-form.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    SystemSettingFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    SystemSettingsRoutingModule
  ]
})
export class SystemSettingsModule { }
