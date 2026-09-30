import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';

import { PaymentFrequenciesRoutingModule } from './payment-frequencies-routing.module';
import { PaymentFrequencyListComponent } from './pages/payment-frequency-list/payment-frequency-list.component';
import { PaymentFrequencyFormComponent } from './pages/payment-frequency-form/payment-frequency-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaymentFrequencyDetailsModalComponent } from './components/payment-frequency-details-modal/payment-frequency-details-modal.component';

@NgModule({
  declarations: [
    PaymentFrequencyListComponent,
    PaymentFrequencyFormComponent,
    PaymentFrequencyDetailsModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    InputNumberModule,
    SharedModule,
    PaymentFrequenciesRoutingModule,
  ],
})
export class PaymentFrequenciesModule {}
