import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PositionListComponent } from './pages/position-list/position-list.component';
import { PositionFormComponent } from './pages/position-form/position-form.component';
import { AuthGuard } from 'src/app/core/auth/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: PositionListComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['POSITION_READ'],
    },
  },

  {
    path: 'create',
    component: PositionFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['POSITION_WRITE'],
    },
  },

  {
    path: ':positionId/edit',
    component: PositionFormComponent,
    canActivate: [AuthGuard],
    data: {
      authorities: ['POSITION_WRITE'],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PositionsRoutingModule {}
