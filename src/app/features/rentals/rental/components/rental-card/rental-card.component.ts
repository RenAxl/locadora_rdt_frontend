import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Rental } from '../../models/Rental';

@Component({
  selector: 'app-rental-card',
  templateUrl: './rental-card.component.html',
  styleUrls: ['./rental-card.component.css'],
})
export class RentalCardComponent {
  @Input() rental!: Rental;
  @Input() visibleFields: string[] = [];
  @Input() canRead = false;
  @Input() canWrite = false;
  @Input() canDelete = false;

  @Output() details = new EventEmitter<Rental>();
  @Output() start = new EventEmitter<Rental>();
  @Output() overdueDetails = new EventEmitter<Rental>();
  @Output() receipt = new EventEmitter<Rental>();
  @Output() fiscalCoupon = new EventEmitter<Rental>();
  @Output() delete = new EventEmitter<Rental>();

  isOverdue(): boolean {
    return this.rental.overdueDays > 0;
  }

  getStatusLabel(): string {
    if (this.rental.status === 'RENTED') {
      return 'Alugada';
    }

    if (this.rental.status === 'DELIVERED') {
      return 'Entregue';
    }

    return this.rental.status || '-';
  }

  getStatusClass(): string {
    if (this.rental.status === 'DELIVERED') {
      return 'status-delivered';
    }

    return 'status-rented';
  }

  isFieldVisible(field: string): boolean {
    return this.visibleFields.includes(field);
  }

  hasMainFields(): boolean {
    return this.isFieldVisible('id')
      || this.isFieldVisible('rentalNumber')
      || this.isFieldVisible('customerName')
      || this.isFieldVisible('rentalTypeName')
      || this.isFieldVisible('status');
  }

  hasSummaryFields(): boolean {
    for (const field of this.visibleFields) {
      if (field !== 'id' && field !== 'rentalNumber' && field !== 'customerName'
          && field !== 'rentalTypeName' && field !== 'status') {
        return true;
      }
    }

    return false;
  }
}
