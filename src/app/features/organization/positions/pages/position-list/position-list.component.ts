import { Component, ViewChild } from '@angular/core';

import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Pagination } from 'src/app/core/models/Pagination';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';

import { Position } from '../../models/Position';
import { PositionService } from '../../services/position.service';
import { PositionDTO } from '../../dtos/position-dto';
import { PositionMapper } from '../../mapper/position.mapper';
import { DataTableColumn } from 'src/app/shared/components/data-table/models/data-table-column';
import { Observable } from 'rxjs';
import { PageResponse } from 'src/app/core/models/page-response';

@Component({
  selector: 'app-position-list',
  templateUrl: './position-list.component.html',
  styleUrls: ['./position-list.component.css'],
})
export class PositionListComponent {
  positions: Position[] = [];

  pagination: Pagination = new Pagination();

  totalElements: number = 0;

  filterName: string = '';

  loading: boolean = false;

  fieldCustomizationVisible: boolean = false;

  visibleFields: string[] = ['name'];

  availableFields: DataTableColumn[] = [
    { field: 'name', label: 'Nome' },
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

  @ViewChild('positionTable') grid!: DataTableComponent;

  detailsVisible = false;

  positionDetails: Position | null = null;

  constructor(
    private positionService: PositionService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
  ) {}

  list(page: number = 0): void {
    this.pagination.page = page;
    this.loading = true;

    this.positionService.list(this.pagination, this.filterName).subscribe({
      next: (data) => {
        this.positions = [];

        data.content.forEach((dto: PositionDTO) => {
          const position = PositionMapper.toModel(dto);
          this.positions.push(position);
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

  searchPosition(name: string): void {
    this.filterName = name;
    this.list();
  }

  delete(position: Position): void {
    if (!position.id) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.positionService.delete(position.id!).subscribe(() => {
          this.grid.reset();
          this.messageService.add({
            severity: 'success',
            detail: 'Cargo excluído com sucesso!',
          });
        });
      },
    });
  }

  openDetails(position: Position): void {
    const id = position.id;

    if (id == null) {
      return;
    }

    this.detailsVisible = true;
    this.positionDetails = null;

    this.positionService.findById(id).subscribe({
      next: (details: PositionDTO) => {
        this.positionDetails = PositionMapper.toModel(details);
      },
    });
  }

  openFieldCustomization(): void {
    this.fieldCustomizationVisible = true;
  }

  applyVisibleFields(fields: string[]): void {
    this.visibleFields = [...fields];
  }

  loadPositionsForExport = (
    pagination: Pagination,
  ): Observable<PageResponse<PositionDTO>> => {
    return this.positionService.list(pagination, this.filterName);
  };

  hasAuthority(authority: string): boolean {
    return this.authService.hasAuthority(authority);
  }

}
