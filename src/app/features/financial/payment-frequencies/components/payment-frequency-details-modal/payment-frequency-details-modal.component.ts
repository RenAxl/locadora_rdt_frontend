import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaymentFrequency } from '../../models/PaymentFrequency';

@Component({
  selector: 'app-payment-frequency-details-modal',
  templateUrl: './payment-frequency-details-modal.component.html',
  styleUrls: ['./payment-frequency-details-modal.component.css'],
})
export class PaymentFrequencyDetailsModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() title = 'Detalhamento da Frequência de Pagamento';
  @Input() paymentFrequency: PaymentFrequency | null = null;

  close(): void {
    this.visibleChange.emit(false);
  }
}
