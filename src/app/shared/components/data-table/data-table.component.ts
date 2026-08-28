import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';
import { DataTableColumn } from 'src/app/shared/components/data-table/models/data-table-column';
import { Observable } from 'rxjs';
import { PageResponse } from 'src/app/core/models/page-response';
import { Pagination } from 'src/app/core/models/Pagination';

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
  @Input() showColumnsButton: boolean = false;
  @Input() showExportButton: boolean = false;
  @Input() exportTitle: string = '';
  @Input() exportFileName: string = '';
  @Input() exportPagination: Pagination = new Pagination();
  @Input() exportLoadRecords!: (
    pagination: Pagination,
  ) => Observable<PageResponse<any>>;

  @Output() selectedRecordsChange = new EventEmitter<any[]>();
  @Output() lazyLoad = new EventEmitter<LazyLoadEvent>();
  @Output() rowSelect = new EventEmitter<any>();
  @Output() rowUnselect = new EventEmitter<any>();
  @Output() columnsButtonClick = new EventEmitter<void>();

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

  getFieldValue(record: any, field: string): any {
    const fields = field.split('.');
    let value = record;

    fields.forEach((item) => {
      if (value != null) {
        value = value[item];
      }
    });

    if (value === null || value === undefined || value === '') {
      return '-';
    }

    return value;
  }

  openColumns(): void {
    this.columnsButtonClick.emit();
  }

  reset(): void {
    this.table.reset();
  }
}
