import { Component } from '@angular/core';

import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Pagination } from 'src/app/core/models/Pagination';
import { LazyLoadEvent } from 'primeng/api';

import { StockMovement } from '../../models/StockMovement';
import { StockMovementService } from '../../services/stock-movement.service';
import { StockMovementDTO } from '../../dtos/stock-movement-dto';
import { StockMovementMapper } from '../../mapper/stock-movement.mapper';
import { DataTableColumn } from 'src/app/shared/components/data-table/models/data-table-column';
import { map, Observable } from 'rxjs';
import { PageResponse } from 'src/app/core/models/page-response';
import { getItemUnitStatusLabel } from '../../../item-units/constants/item-unit-options';

@Component({
  selector: 'app-stock-movement-list',
  templateUrl: './stock-movement-list.component.html',
  styleUrls: ['./stock-movement-list.component.css'],
})
export class StockMovementListComponent {
  stockMovements: StockMovement[] = [];

  pagination: Pagination = new Pagination(0, 5, 'DESC', 'createdAt');

  totalElements: number = 0;

  filterName: string = '';

  loading: boolean = false;

  fieldCustomizationVisible: boolean = false;

  visibleFields: string[] = [
    'createdAt',
    'itemName',
    'assetCode',
    'type',
    'previousStatus',
    'newStatus',
    'quantity',
    'reason',
    'createdBy',
  ];

  availableFields: DataTableColumn[] = [
    { field: 'createdAt', label: 'Data' },
    { field: 'itemName', label: 'Item' },
    { field: 'assetCode', label: 'Código patrimonial' },
    { field: 'type', label: 'Tipo' },
    { field: 'previousStatus', label: 'Situação anterior' },
    { field: 'newStatus', label: 'Nova situação' },
    { field: 'quantity', label: 'Quantidade' },
    { field: 'reason', label: 'Motivo' },
    { field: 'createdBy', label: 'Usuário' },
  ];

  get visibleTableColumns(): DataTableColumn[] {
    const columns: DataTableColumn[] = [];

    for (const column of this.availableFields) {
      if (this.visibleFields.includes(column.field)) {
        columns.push(column);
      }
    }

    return columns;
  }

  constructor(
    private stockMovementService: StockMovementService,
    private authService: AuthService,
  ) {}

  list(page: number = 0): void {
    this.pagination.page = page;
    this.loading = true;

    this.stockMovementService.list(this.pagination, this.filterName).subscribe({
      next: (data) => {
        this.stockMovements = [];

        data.content.forEach((dto: StockMovementDTO) => {
          const stockMovement = StockMovementMapper.toModel(dto);
          this.stockMovements.push(stockMovement);
        });

        this.totalElements = data.totalElements;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  changePage(event: LazyLoadEvent): void {
    let first = 0;
    let rows = 1;

    if (event.first != null) {
      first = event.first;
    }

    if (event.rows != null) {
      rows = event.rows;
    }

    if (typeof event.sortField === 'string') {
      this.pagination.orderBy = event.sortField;

      if (event.sortOrder === -1) {
        this.pagination.direction = 'DESC';
      } else {
        this.pagination.direction = 'ASC';
      }
    }

    const page = first / rows;
    this.pagination.linesPerPage = rows;
    this.list(page);
  }

  searchStockMovement(name: string): void {
    this.filterName = name;
    this.list();
  }

  openFieldCustomization(): void {
    this.fieldCustomizationVisible = true;
  }

  applyVisibleFields(fields: string[]): void {
    this.visibleFields = [...fields];
  }

  loadStockMovementsForExport = (
    pagination: Pagination,
  ): Observable<PageResponse<StockMovementDTO>> => {
    return this.stockMovementService.list(pagination, this.filterName).pipe(
      map((data) => {
        const stockMovements: StockMovementDTO[] = [];

        data.content.forEach((dto: StockMovementDTO) => {
          const stockMovement = StockMovementMapper.toModel(dto);

          const stockMovementToExport = {
            ...dto,
            type: this.getTypeLabel(stockMovement.type),
            previousStatus: this.getStatusLabel(stockMovement.previousStatus),
            newStatus: this.getStatusLabel(stockMovement.newStatus),
          };

          stockMovements.push(stockMovementToExport);
        });

        return {
          content: stockMovements,
          totalElements: data.totalElements,
        };
      }),
    );
  };

  getTypeLabel(type: string): string {
    if (type === 'ENTRY') {
      return 'Entrada';
    }

    if (type === 'EXIT') {
      return 'Saída definitiva';
    }

    if (type === 'ADJUSTMENT') {
      return 'Ajuste';
    }

    if (type === 'STATUS_CHANGE') {
      return 'Alteração de situação';
    }

    return type || '-';
  }

  getStatusLabel(status?: string | null): string {
    return getItemUnitStatusLabel(status);
  }

  hasAuthority(authority: string): boolean {
    return this.authService.hasAuthority(authority);
  }
}
