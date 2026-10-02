import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-receivable-payment-charges-modal',
  templateUrl: './receivable-payment-charges-modal.component.html',
  styleUrls: ['./receivable-payment-charges-modal.component.css'],
})
export class ReceivablePaymentChargesModalComponent implements OnChanges {
  @Input() visible = false;
  @Input() lateFee: number = 0;
  @Input() lateInterest: number = 0;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() confirmCharges = new EventEmitter<{ lateFee: number; lateInterest: number }>();

  editedLateFee: number = 0;
  editedLateInterest: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    const visibleChanged = changes['visible'] !== undefined;

    if (visibleChanged && this.visible) {
      this.editedLateFee = Number(this.lateFee ?? 0);
      this.editedLateInterest = Number(this.lateInterest ?? 0);
    }
  }

  close(): void {
    this.visibleChange.emit(false);
  }

  confirm(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.confirmCharges.emit({
      lateFee: this.roundMoney(this.editedLateFee),
      lateInterest: this.roundMoney(this.editedLateInterest),
    });
  }

  private roundMoney(value: number | null | undefined): number {
    return Math.round(Number(value ?? 0) * 100) / 100;
  }
}
