import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';

const routes: Routes = [
  {
    path: '',
    component: ActivateAccountComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActivateAccountRoutingModule {}
