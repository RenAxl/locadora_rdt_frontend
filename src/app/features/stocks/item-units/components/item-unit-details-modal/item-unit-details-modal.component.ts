import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ItemUnit } from '../../models/ItemUnit';

@Component({
  selector: 'app-item-unit-details-modal',
  templateUrl: './item-unit-details-modal.component.html',
  styleUrls: ['./item-unit-details-modal.component.css'],
})
export class ItemUnitDetailsModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() title = 'Detalhamento da Unidade Física';
  @Input() unit: ItemUnit | null = null;

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

  getStatusLabel(status: string): string {
    if (status === 'AVAILABLE') {
      return 'Disponível';
    }

    if (status === 'RESERVED') {
      return 'Reservada';
    }

    if (status === 'RENTED') {
      return 'Alugada';
    }

    if (status === 'MAINTENANCE') {
      return 'Em manutenção';
    }

    return status;
  }

  getConditionLabel(condition: string): string {
    if (condition === 'NEW') {
      return 'Nova';
    }

    if (condition === 'GOOD') {
      return 'Boa';
    }

    if (condition === 'DAMAGED') {
      return 'Danificada';
    }

    return condition;
  }
}
