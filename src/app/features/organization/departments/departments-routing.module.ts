import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DepartmentListComponent } from './pages/department-list/department-list.component';
import { DepartmentFormComponent } from './pages/department-form/department-form.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: DepartmentListComponent,
    canActivate: [AuthGuard],
    data: { authorities: ['DEPARTMENT_READ'] },
  },

  {
    path: 'create',
    component: DepartmentFormComponent,
    canActivate: [AuthGuard],
    data: { authorities: ['DEPARTMENT_WRITE'] },
  },

  {
    path: ':departmentId/edit',
    component: DepartmentFormComponent,
    canActivate: [AuthGuard],
    data: { authorities: ['DEPARTMENT_WRITE'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DepartmentsRoutingModule {}
