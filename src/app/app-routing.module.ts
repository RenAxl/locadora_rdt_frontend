import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './shell/main/main.component';
import { AuthComponent } from './shell/auth/auth.component';
import { NotAuthorizedComponent } from './core/pages/not-authorized/not-authorized.component';
import { PageNotFoundComponent } from './core/pages/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'customer-account',
        loadChildren: () =>
          import('./features/identity/customer-account/customer-account.module').then(
            (m) => m.CustomerAccountModule,
          ),
      },

      {
        path: 'login',
        loadChildren: () =>
          import('./features/identity/login/login.module').then(
            (m) => m.LoginModule,
          ),
      },
    ],
  },

  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'activate',
        loadChildren: () =>
          import('./features/identity/activate-account/activate-account.module').then(
            (m) => m.ActivateAccountModule,
          ),
      },
    ],
  },

  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'password-recovery',
        loadChildren: () =>
          import('./features/identity/password-recovery/password-recovery.module').then(
            (m) => m.RecoveryPasswordModule,
          ),
      },
    ],
  },

  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'home',
        loadChildren: () =>
          import('./features/home/home.module').then((m) => m.HomeModule),
      },
    ],
  },

  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'users',
        loadChildren: () =>
          import('./features/identity/users/users.module').then(
            (m) => m.UsersModule,
          ),
      },

      {
        path: 'departments',
        loadChildren: () =>
          import('./features/organization/departments/departments.module').then(
            (m) => m.DepartmentsModule,
          ),
      },

      {
        path: 'customers',
        loadChildren: () =>
          import('./features/organization/customers/customers.module').then(
            (m) => m.CustomersModule,
          ),
      },

      {
        path: 'roles',
        loadChildren: () =>
          import('./features/identity/roles/roles.module').then(
            (m) => m.RolesModule,
          ),
      },

      {
        path: 'system-settings',
        loadChildren: () =>
          import('./features/settings/system-settings/system-settings.module').then(
            (m) => m.SystemSettingsModule,
          ),
      },
    ],
  },

  {
    path: 'not-authorized',
    component: NotAuthorizedComponent,
  },
  {
    path: 'page-not-found',
    component: PageNotFoundComponent,
  },

  { path: '**', redirectTo: 'page-not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
