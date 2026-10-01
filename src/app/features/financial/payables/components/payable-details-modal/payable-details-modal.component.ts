import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Payable } from '../../models/Payable';

@Component({
  selector: 'app-payable-details-modal',
  templateUrl: './payable-details-modal.component.html',
  styleUrls: ['./payable-details-modal.component.css'],
})
export class PayableDetailsModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() title = 'Detalhamento da Conta a Pagar';
  @Input() payable: Payable | null = null;

  close(): void {
    this.visibleChange.emit(false);
  }
}
