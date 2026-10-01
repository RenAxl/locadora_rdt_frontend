import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';

import { PaymentMethodsRoutingModule } from './payment-methods-routing.module';
import { PaymentMethodListComponent } from './pages/payment-method-list/payment-method-list.component';
import { PaymentMethodFormComponent } from './pages/payment-method-form/payment-method-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PaymentMethodDetailsModalComponent } from './components/payment-method-details-modal/payment-method-details-modal.component';

@NgModule({
  declarations: [
    PaymentMethodListComponent,
    PaymentMethodFormComponent,
    PaymentMethodDetailsModalComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    InputNumberModule,
    SharedModule,
    PaymentMethodsRoutingModule,
  ],
})
export class PaymentMethodsModule {}
