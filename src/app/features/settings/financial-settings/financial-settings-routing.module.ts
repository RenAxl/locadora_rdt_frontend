import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FinancialSettingFormComponent } from './pages/financial-setting-form/financial-setting-form.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: FinancialSettingFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['FINANCIAL_SETTINGS_READ'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinancialSettingsRoutingModule {}
