import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-payable-payment-choice-modal',
  templateUrl: './payable-payment-choice-modal.component.html',
  styleUrls: ['./payable-payment-choice-modal.component.css'],
})
export class PayablePaymentChoiceModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() editCharges = new EventEmitter<void>();
  @Output() useDefaultCharges = new EventEmitter<void>();

  close(): void {
    this.visibleChange.emit(false);
  }
}
