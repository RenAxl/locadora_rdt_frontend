import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-receivable-payment-choice-modal',
  templateUrl: './receivable-payment-choice-modal.component.html',
  styleUrls: ['./receivable-payment-choice-modal.component.css'],
})
export class ReceivablePaymentChoiceModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() editCharges = new EventEmitter<void>();
  @Output() useDefaultCharges = new EventEmitter<void>();

  close(): void {
    this.visibleChange.emit(false);
  }
}
