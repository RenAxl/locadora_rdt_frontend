import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Receivable } from '../../models/Receivable';

@Component({
  selector: 'app-receivable-details-modal',
  templateUrl: './receivable-details-modal.component.html',
  styleUrls: ['./receivable-details-modal.component.css'],
})
export class ReceivableDetailsModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() title = 'Detalhamento da Conta a Receber';
  @Input() receivable: Receivable | null = null;

  close(): void {
    this.visibleChange.emit(false);
  }
}
