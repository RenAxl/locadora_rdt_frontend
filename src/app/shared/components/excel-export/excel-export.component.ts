import { Component, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResponse } from 'src/app/core/models/page-response';
import { Pagination } from 'src/app/core/models/Pagination';
import { ListingExportService } from '../../services/listing-export.service';
import { CustomizableField } from '../../models/customizable-field';

@Component({
  selector: 'app-excel-export',
  templateUrl: './excel-export.component.html',
})
export class ExcelExportComponent {
  @Input() title: string = '';
  @Input() fileName: string = '';
  @Input() fields: CustomizableField[] = [];
  @Input() pagination: Pagination = new Pagination();
  @Input() totalRecords: number = 0;
  @Input() loadRecords!: (
    pagination: Pagination,
  ) => Observable<PageResponse<any>>;

  constructor(private listingExportService: ListingExportService) {}

  exportExcel(): void {
    if (!this.loadRecords) {
      return;
    }

    this.listingExportService.confirmAndExport(
      this.title,
      this.fileName,
      this.fields,
      this.pagination,
      this.totalRecords,
      this.loadRecords,
    );
  }
}
