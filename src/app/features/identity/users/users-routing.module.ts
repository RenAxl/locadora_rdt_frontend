import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserFormComponent } from './pages/user-form/user-form.component';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,

  },

  {
    path: 'create',
    component: UserFormComponent,
  },

  {
    path: ':userId/edit',
    component: UserFormComponent,
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
