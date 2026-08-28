import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Observable } from 'rxjs';
import { API } from 'src/app/core/config/api.config';
import { PageResponse } from 'src/app/core/models/page-response';
import { Pagination } from 'src/app/core/models/Pagination';
import { CustomizableField } from '../models/customizable-field';

@Injectable({ providedIn: 'root' })
export class ListingExportService {
  constructor(
    private http: HttpClient,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
  ) {}

  confirmAndExport<T>(
    title: string,
    fileName: string,
    fields: CustomizableField[],
    pagination: Pagination,
    totalElements: number,
    load: (pagination: Pagination) => Observable<PageResponse<T>>,
  ): void {
    this.confirmationService.confirm({
      message: 'Deseja exportar a listagem para o Excel?',
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        const exportPagination = new Pagination(
          0,
          Math.max(totalElements, 1),
          pagination.direction,
          pagination.orderBy,
        );

        load(exportPagination).subscribe({
          next: (page) => this.generateFile(title, fileName, fields, page.content),
          error: () => this.showError(),
        });
      },
    });
  }

  private generateFile<T>(
    title: string,
    fileName: string,
    fields: CustomizableField[],
    items: T[],
  ): void {
    const request = {
      title,
      columns: fields.map((field) => field.label),
      rows: items.map((item) => this.createRow(item, fields)),
    };

    this.http.post(API.LISTING_EXPORTS.EXCEL, request, { responseType: 'blob' }).subscribe({
      next: (file) => this.download(file, fileName),
      error: () => this.showError(),
    });
  }

  private createRow<T>(item: T, fields: CustomizableField[]): { [key: string]: string } {
    const row: { [key: string]: string } = {};

    fields.forEach((field, index) => {
      row[`column${index}`] = this.formatValue(this.getValue(item, field.field));
    });

    return row;
  }

  private getValue(item: any, field: string): any {
    const fieldParts = field.split('.');
    let value = item;

    for (const fieldPart of fieldParts) {
      if (value === null || value === undefined) {
        return '';
      }

      value = value[fieldPart];
    }

    return value;
  }

  private formatValue(value: any): string {
    if (value === true) return 'Sim';
    if (value === false) return 'Não';
    if (value === null || value === undefined) return '';
    if (Array.isArray(value)) return value.map((item) => this.formatValue(item)).join(', ');
    if (typeof value === 'object') return value.name || value.description || '';
    return String(value);
  }

  private download(file: Blob, fileName: string): void {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.xlsx`;
    link.click();
    URL.revokeObjectURL(url);
  }

  private showError(): void {
    this.messageService.add({
      severity: 'error',
      detail: 'Não foi possível exportar a listagem para o Excel.',
    });
  }
}
