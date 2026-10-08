import { Component, EventEmitter, Input, Output } from '@angular/core';

import { RentalType } from '../../models/RentalType';

@Component({
  selector: 'app-rental-type-details-modal',
  templateUrl: './rental-type-details-modal.component.html',
  styleUrls: ['./rental-type-details-modal.component.css'],
})
export class RentalTypeDetailsModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() title = 'Detalhamento do Tipo de Locação';
  @Input() rentalType: RentalType | null = null;

  close(): void {
    this.visibleChange.emit(false);
  }

  getActiveLabel(active?: boolean): string {
    if (active === undefined || active === null) {
      return '-';
    }

    if (active) {
      return 'Sim';
    }

    return 'Não';
  }
}
