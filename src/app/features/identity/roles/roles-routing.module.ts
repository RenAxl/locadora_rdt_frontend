import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoleListComponent } from './pages/role-list/role-list.component';
import { RoleFormComponent } from './pages/role-form/role-form.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: RoleListComponent,
    canActivate: [AuthGuard],
    data: { authorities: ['ROLE_READ'] },
  },

  {
    path: 'create',
    component: RoleFormComponent,
    canActivate: [AuthGuard],
    data: { authorities: ['ROLE_WRITE'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RolesRoutingModule {}
