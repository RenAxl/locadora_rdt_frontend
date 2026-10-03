import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent } from './pages/category-list/category-list.component';
import { CategoryFormComponent } from './pages/category-form/category-form.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: CategoryListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['CATEGORY_READ'],
    },
  },

  {
    path: 'create',
    component: CategoryFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['CATEGORY_WRITE'],
    },
  },

  {
    path: ':categoryId/edit',
    component: CategoryFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['CATEGORY_WRITE'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CategoriesRoutingModule {}
