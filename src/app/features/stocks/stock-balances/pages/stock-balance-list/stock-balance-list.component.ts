import { Component } from '@angular/core';

import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Pagination } from 'src/app/core/models/Pagination';
import { LazyLoadEvent, MessageService } from 'primeng/api';

import { StockBalance } from '../../models/StockBalance';
import { StockBalanceService } from '../../services/stock-balance.service';
import { StockBalanceDTO } from '../../dtos/stock-balance-dto';
import { StockBalanceMapper } from '../../mapper/stock-balance.mapper';
import { DataTableColumn } from 'src/app/shared/components/data-table/models/data-table-column';
import { Observable } from 'rxjs';
import { PageResponse } from 'src/app/core/models/page-response';

@Component({
  selector: 'app-stock-balance-list',
  templateUrl: './stock-balance-list.component.html',
  styleUrls: ['./stock-balance-list.component.css'],
})
export class StockBalanceListComponent {
  stockBalances: StockBalance[] = [];

  pagination: Pagination = new Pagination(0, 5, 'ASC', 'item.name');

  totalElements: number = 0;

  filterName: string = '';

  loading: boolean = false;

  fieldCustomizationVisible: boolean = false;

  visibleFields: string[] = [
    'itemName',
    'totalQuantity',
    'availableQuantity',
    'reservedQuantity',
    'unavailableQuantity',
    'minimumQuantity',
    'lowStock',
  ];

  availableFields: DataTableColumn[] = [
    { field: 'itemName', label: 'Item' },
    { field: 'totalQuantity', label: 'Total' },
    { field: 'availableQuantity', label: 'Disponível' },
    { field: 'reservedQuantity', label: 'Alugado' },
    { field: 'unavailableQuantity', label: 'Indisponível' },
    { field: 'minimumQuantity', label: 'Mínimo' },
    { field: 'lowStock', label: 'Alerta' },
    { field: 'createdAt', label: 'Data cadastro' },
    { field: 'updatedAt', label: 'Data atualização' },
    { field: 'createdBy', label: 'Criado por' },
    { field: 'updatedBy', label: 'Atualizado por' },
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
    private stockBalanceService: StockBalanceService,
    private messageService: MessageService,
    private authService: AuthService,
  ) {}

  list(page: number = 0): void {
    this.pagination.page = page;
    this.loading = true;

    this.stockBalanceService.list(this.pagination, this.filterName).subscribe({
      next: (data) => {
        this.stockBalances = [];

        data.content.forEach((dto: StockBalanceDTO) => {
          const stockBalance = StockBalanceMapper.toModel(dto);
          this.stockBalances.push(stockBalance);
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
    }

    if (event.sortOrder === -1) {
      this.pagination.direction = 'DESC';
    } else {
      this.pagination.direction = 'ASC';
    }

    const page = first / rows;
    this.pagination.linesPerPage = rows;
    this.list(page);
  }

  searchStockBalance(name: string): void {
    this.filterName = name;
    this.list();
  }

  updateMinimum(stockBalance: StockBalance): void {
    if (!stockBalance.id) {
      return;
    }

    let minimumQuantity = Number(stockBalance.minimumQuantity ?? 0);

    if (minimumQuantity < 0) {
      minimumQuantity = 0;
    }

    stockBalance.minimumQuantity = minimumQuantity;

    const stockBalanceToUpdate =
      StockBalanceMapper.toMinimumUpdateDTO(stockBalance);

    this.stockBalanceService.updateMinimum(stockBalanceToUpdate).subscribe({
      next: (data) => {
        const stockBalanceUpdated = StockBalanceMapper.toModel(data);

        for (let index = 0; index < this.stockBalances.length; index++) {
          if (this.stockBalances[index].id === stockBalanceUpdated.id) {
            this.stockBalances[index] = stockBalanceUpdated;
            break;
          }
        }

        this.messageService.add({
          severity: 'success',
          detail: 'Estoque mínimo atualizado!',
        });
      },
      error: () => {
        this.list(this.pagination.page);
      },
    });
  }

  openFieldCustomization(): void {
    this.fieldCustomizationVisible = true;
  }

  applyVisibleFields(fields: string[]): void {
    this.visibleFields = [...fields];
  }

  loadStockBalancesForExport = (
    pagination: Pagination,
  ): Observable<PageResponse<StockBalanceDTO>> => {
    return this.stockBalanceService.list(pagination, this.filterName);
  };

  hasAuthority(authority: string): boolean {
    return this.authService.hasAuthority(authority);
  }
}
