import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';

import { FinancialSettingsRoutingModule } from './financial-settings-routing.module';
import { FinancialSettingFormComponent } from './pages/financial-setting-form/financial-setting-form.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    FinancialSettingFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputNumberModule,
    SharedModule,
    FinancialSettingsRoutingModule,
  ],
})
export class FinancialSettingsModule {}
