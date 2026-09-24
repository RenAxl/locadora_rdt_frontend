import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';

import { PositionsRoutingModule } from './positions-routing.module';
import { PositionListComponent } from './pages/position-list/position-list.component';
import { PositionFormComponent } from './pages/position-form/position-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PositionDetailsModalComponent } from './components/position-details-modal/position-details-modal.component';

@NgModule({
  declarations: [
    PositionListComponent,
    PositionFormComponent,
    PositionDetailsModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    SharedModule,
    PositionsRoutingModule,
  ],
})
export class PositionsModule {}
