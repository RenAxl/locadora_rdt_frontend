import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { PaginatorModule } from 'primeng/paginator';

import { ReceivablesRoutingModule } from './receivables-routing.module';
import { ReceivableListComponent } from './pages/receivable-list/receivable-list.component';
import { ReceivableFormComponent } from './pages/receivable-form/receivable-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReceivableDetailsModalComponent } from './components/receivable-details-modal/receivable-details-modal.component';
import { ReceivableFilesModalComponent } from './components/receivable-files-modal/receivable-files-modal.component';
import { ReceivableFiltersComponent } from './components/receivable-filters/receivable-filters.component';
import { ReceivableQuickPeriodFilterComponent } from './components/receivable-quick-period-filter/receivable-quick-period-filter.component';
import { ReceivableOverdueModalComponent } from './components/receivable-overdue-modal/receivable-overdue-modal.component';
import { ReceivablePaymentChargesModalComponent } from './components/receivable-payment-charges-modal/receivable-payment-charges-modal.component';
import { ReceivablePaymentChoiceModalComponent } from './components/receivable-payment-choice-modal/receivable-payment-choice-modal.component';
import { ReceivablePaymentModalComponent } from './components/receivable-payment-modal/receivable-payment-modal.component';

@NgModule({
  declarations: [
    ReceivableListComponent,
    ReceivableFormComponent,
    ReceivableDetailsModalComponent,
    ReceivableFilesModalComponent,
    ReceivableOverdueModalComponent,
    ReceivablePaymentChoiceModalComponent,
    ReceivablePaymentChargesModalComponent,
    ReceivablePaymentModalComponent,
    ReceivableFiltersComponent,
    ReceivableQuickPeriodFilterComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    InputNumberModule,
    PaginatorModule,
    SharedModule,
    ReceivablesRoutingModule,
  ],
})
export class ReceivablesModule {}
