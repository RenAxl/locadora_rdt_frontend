import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { PaymentMethod } from '../../models/PaymentMethod';

@Component({
  selector: 'app-payment-method-details-modal',
  templateUrl: './payment-method-details-modal.component.html',
  styleUrls: ['./payment-method-details-modal.component.css'],
})
export class PaymentMethodDetailsModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() title = 'Detalhamento da Forma de Pagamento';
  @Input() paymentMethod: PaymentMethod | null = null;

  close(): void {
    this.visibleChange.emit(false);
  }
}
