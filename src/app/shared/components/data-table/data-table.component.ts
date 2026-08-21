import { Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';

export interface DataTableColumn {
  field: string;
  label: string;
  sortable?: boolean;
}

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})
export class DataTableComponent {
  @Input() records: any[] = [];
  @Input() columns: DataTableColumn[] = [];
  @Input() selectedRecords: any[] = [];
  @Input() totalRecords: number = 0;
  @Input() rows: number = 5;
  @Input() loading: boolean = false;
  @Input() dataKey: string = 'id';
  @Input() emptyMessage: string = 'Nenhum registro encontrado.';
  @Input() columnTemplates: { [field: string]: TemplateRef<any> } = {};
  @Input() actionsTemplate: TemplateRef<any> | null = null;

  @Output() selectedRecordsChange = new EventEmitter<any[]>();
  @Output() lazyLoad = new EventEmitter<LazyLoadEvent>();
  @Output() rowSelect = new EventEmitter<any>();
  @Output() rowUnselect = new EventEmitter<any>();

  @ViewChild('table') table!: Table;

  changeSelection(records: any[]): void {
    this.selectedRecords = records;
    this.selectedRecordsChange.emit(records);
  }

  load(event: LazyLoadEvent): void {
    this.lazyLoad.emit(event);
  }

  select(event: any): void {
    this.rowSelect.emit(event);
  }

  unselect(event: any): void {
    this.rowUnselect.emit(event);
  }

  hasTemplate(field: string): boolean {
    return this.columnTemplates[field] != null;
  }

  getTemplate(field: string): TemplateRef<any> {
    return this.columnTemplates[field];
  }

  reset(): void {
    this.table.reset();
  }
  
}
