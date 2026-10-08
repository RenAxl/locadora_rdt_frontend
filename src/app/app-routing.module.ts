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
        path: 'catalog',
        loadChildren: () =>
          import('./features/rentals/catalog/catalog.module').then(
            (m) => m.CatalogModule,
          ),
      },
    ],
  },

  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: 'contact',
        loadChildren: () =>
          import('./features/contact/contact.module').then(
            (m) => m.ContactModule,
          ),
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
        path: 'rental-types',
        loadChildren: () =>
          import('./features/rentals/rental-types/rental-types.module').then(
            (m) => m.RentalTypesModule,
          ),
      },
      
      {
        path: 'rental',
        loadChildren: () =>
          import('./features/rentals/rental/rental.module').then(
            (m) => m.RentalModule,
          ),
      },

      {
        path: 'positions',
        loadChildren: () =>
          import('./features/organization/positions/positions.module').then(
            (m) => m.PositionsModule,
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
        path: 'categories',
        loadChildren: () =>
          import('./features/stocks/categories/categories.module').then(
            (m) => m.CategoriesModule,
          ),
      },

      {
        path: 'items',
        loadChildren: () =>
          import('./features/stocks/items/items.module').then(
            (m) => m.ItemsModule,
          ),
      },

      {
        path: 'item-units',
        loadChildren: () =>
          import('./features/stocks/item-units/item-units.module').then(
            (m) => m.ItemUnitsModule,
          ),
      },

      {
        path: 'stock-balances',
        loadChildren: () =>
          import('./features/stocks/stock-balances/stock-balances.module').then(
            (m) => m.StockBalancesModule,
          ),
      },

      {
        path: 'stock-movements',
        loadChildren: () =>
          import('./features/stocks/stock-movements/stock-movements.module').then(
            (m) => m.StockMovementsModule,
          ),
      },

      {
        path: 'payables',
        loadChildren: () =>
          import('./features/financial/payables/payables.module').then(
            (m) => m.PayablesModule,
          ),
      },

      {
        path: 'receivables',
        loadChildren: () =>
          import('./features/financial/receivables/receivables.module').then(
            (m) => m.ReceivablesModule,
          ),
      },

      {
        path: 'payment-methods',
        loadChildren: () =>
          import('./features/financial/payment-methods/payment-methods.module').then(
            (m) => m.PaymentMethodsModule,
          ),
      },

      {
        path: 'payment-frequencies',
        loadChildren: () =>
          import('./features/financial/payment-frequencies/payment-frequencies.module').then(
            (m) => m.PaymentFrequenciesModule,
          ),
      },

      {
        path: 'employees',
        loadChildren: () =>
          import('./features/organization/employees/employees.module').then(
            (m) => m.EmployeesModule,
          ),
      },

      {
        path: 'suppliers',
        loadChildren: () =>
          import('./features/organization/suppliers/suppliers.module').then(
            (m) => m.SuppliersModule,
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

      {
        path: 'financial-settings',
        loadChildren: () =>
          import('./features/settings/financial-settings/financial-settings.module').then(
            (m) => m.FinancialSettingsModule,
          ),
      },

      {
        path: 'reports',
        loadChildren: () =>
          import('./features/reports/reports.module').then(
            (m) => m.ReportsModule,
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
