import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeListComponent } from './pages/employee-list/employee-list.component';
import { EmployeeFormComponent } from './pages/employee-form/employee-form.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: EmployeeListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['EMPLOYEE_READ'],
    },
  },

  {
    path: 'create',
    component: EmployeeFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['EMPLOYEE_WRITE'],
    },
  },

  {
    path: ':employeeId/edit',
    component: EmployeeFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['EMPLOYEE_WRITE'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EmployeesRoutingModule {}
