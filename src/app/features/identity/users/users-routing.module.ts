import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserListComponent } from './pages/user-list/user-list.component';
import { UserProfileFormComponent } from './pages/user-profile-form/user-profile-form.component';
import { UserFormComponent } from './pages/user-form/user-form.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: UserListComponent,
    canActivate: [AuthGuard],
    data: { authorities: ['USER_READ'] },
  },

  {
    path: 'create',
    component: UserFormComponent,
    canActivate: [AuthGuard],
    data: { authorities: ['USER_WRITE'] },
  },

  {
    path: 'profile',
    component: UserProfileFormComponent,
    canActivate: [AuthGuard],
    data: { authorities: ['USER_PROFILE_READ'] },
  },

  {
    path: ':userId/edit',
    component: UserFormComponent,
    canActivate: [AuthGuard],
    data: { authorities: ['USER_WRITE'] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
