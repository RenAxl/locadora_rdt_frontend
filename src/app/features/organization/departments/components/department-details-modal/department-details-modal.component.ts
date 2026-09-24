import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Department } from '../../models/Department';

@Component({
  selector: 'app-department-details-modal',
  templateUrl: './department-details-modal.component.html',
  styleUrls: ['./department-details-modal.component.css'],
})
export class DepartmentDetailsModalComponent {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() title = 'Detalhamento do Departamento';
  @Input() department: Department | null = null;

  close(): void {
    this.visibleChange.emit(false);
  }
}
