import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Receivable } from '../../models/Receivable';

@Component({
  selector: 'app-receivable-overdue-modal',
  templateUrl: './receivable-overdue-modal.component.html',
  styleUrls: ['./receivable-overdue-modal.component.css'],
})
export class ReceivableOverdueModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() receivable: Receivable | null = null;

  close(): void {
    this.visibleChange.emit(false);
  }

  getCurrentAmount(): number {
    return Number(this.receivable?.currentAmountWithLateCharges ?? this.receivable?.amount ?? 0);
  }

  getOverdueDays(): number {
    return Number(this.receivable?.overdueDays ?? 0);
  }

  getCalculatedLateInterest(): number {
    return Number(this.receivable?.calculatedLateInterest ?? 0);
  }

  getCalculatedLateFee(): number {
    return Number(this.receivable?.calculatedLateFee ?? 0);
  }
}
