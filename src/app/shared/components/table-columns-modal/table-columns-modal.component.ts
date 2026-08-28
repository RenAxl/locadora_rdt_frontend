import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

export interface TableColumnOption {
  field: string;
  label: string;
}

@Component({
  selector: 'app-table-columns-modal',
  templateUrl: './table-columns-modal.component.html',
  styleUrls: ['./table-columns-modal.component.css'],
})
export class TableColumnsModalComponent implements OnChanges {
  @Input() visible: boolean = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() selectedColumns: string[] = [];
  @Input() columns: TableColumnOption[] = [];
  @Input() entityName: string = '';
  @Output() apply = new EventEmitter<string[]>();

  columnsToApply: string[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] && this.visible) {
      this.columnsToApply = [...this.selectedColumns];
    }
  }

  onVisibilityChange(visible: boolean): void {
    this.visible = visible;
    this.visibleChange.emit(visible);
  }

  changeColumn(field: string, checked: boolean): void {
    if (checked && !this.columnsToApply.includes(field)) {
      this.columnsToApply.push(field);
    }

    if (!checked) {
      if (this.columnsToApply.length === 1) {
        return;
      }

      this.columnsToApply = this.columnsToApply.filter(
        (column) => column !== field,
      );
    }

    this.apply.emit([...this.columnsToApply]);
  }

  isSelected(field: string): boolean {
    return this.columnsToApply.includes(field);
  }

}
