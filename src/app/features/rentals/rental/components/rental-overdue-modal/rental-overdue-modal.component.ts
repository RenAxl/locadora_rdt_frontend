import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Rental } from '../../models/Rental';

@Component({
  selector: 'app-rental-overdue-modal',
  templateUrl: './rental-overdue-modal.component.html',
  styleUrls: ['./rental-overdue-modal.component.css'],
})
export class RentalOverdueModalComponent {
  @Input() visible = false;
  @Input() rental: Rental | null = null;
  @Output() visibleChange = new EventEmitter<boolean>();

  close(): void {
    this.visibleChange.emit(false);
  }
}
