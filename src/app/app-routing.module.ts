import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './shell/main/main.component';
import { AuthComponent } from './shell/auth/auth.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },

  {
    path: '',
    component: AuthComponent,
    children: [
      {
        path: 'auth',
        loadChildren: () =>
          import('./features/identity/auth/auth.module').then(
            (m) => m.AuthModule,
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
        path: 'roles',
        loadChildren: () =>
          import('./features/identity/roles/roles.module').then(
            (m) => m.RolesModule,
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
