import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Position } from '../../models/Position';

@Component({
  selector: 'app-position-details-modal',
  templateUrl: './position-details-modal.component.html',
  styleUrls: ['./position-details-modal.component.css'],
})
export class PositionDetailsModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() title = 'Detalhamento do Cargo';
  @Input() position: Position | null = null;

  close(): void {
    this.visibleChange.emit(false);
  }
}
