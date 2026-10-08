import { Component, ViewChild } from '@angular/core';

import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Pagination } from 'src/app/core/models/Pagination';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';

import { RentalType } from '../../models/RentalType';
import { RentalTypeService } from '../../services/rental-type.service';
import { RentalTypeDTO } from '../../dtos/rental-type-dto';
import { RentalTypeMapper } from '../../mapper/rental-type.mapper';
import { DataTableColumn } from 'src/app/shared/components/data-table/models/data-table-column';
import { Observable } from 'rxjs';
import { PageResponse } from 'src/app/core/models/page-response';

@Component({
  selector: 'app-rental-type-list',
  templateUrl: './rental-type-list.component.html',
  styleUrls: ['./rental-type-list.component.css'],
})
export class RentalTypeListComponent {
  rentalTypes: RentalType[] = [];

  pagination: Pagination = new Pagination();

  totalElements: number = 0;

  filterName: string = '';

  selectedRentalTypes: RentalType[] = [];

  selectedRentalTypeIds: number[] = [];

  loading: boolean = false;

  fieldCustomizationVisible: boolean = false;

  visibleFields: string[] = ['name', 'type', 'days'];

  availableFields: DataTableColumn[] = [
    { field: 'name', label: 'Nome' },
    { field: 'type', label: 'Tipo' },
    { field: 'days', label: 'Dias' },
    { field: 'active', label: 'Ativo' },
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

  @ViewChild('rentalTypeTable') grid!: DataTableComponent;

  detailsVisible = false;

  rentalTypeDetails: RentalType | null = null;

  constructor(
    private rentalTypeService: RentalTypeService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
  ) {}

  list(page: number = 0): void {
    this.pagination.page = page;
    this.loading = true;

    this.rentalTypeService.list(this.pagination, this.filterName).subscribe({
      next: (data) => {
        this.rentalTypes = [];

        data.content.forEach((dto: RentalTypeDTO) => {
          const rentalType = RentalTypeMapper.toModel(dto);
          this.rentalTypes.push(rentalType);
        });

        this.totalElements = data.totalElements;

        this.selectedRentalTypes = [];
        this.rentalTypes.forEach((rentalType) => {
          if (
            rentalType.id != null &&
            this.selectedRentalTypeIds.includes(rentalType.id)
          ) {
            this.selectedRentalTypes.push(rentalType);
          }
        });

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

  searchRentalType(name: string): void {
    this.filterName = name;
    this.list();
  }

  delete(rentalType: RentalType): void {
    if (!rentalType.id) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.rentalTypeService.delete(rentalType.id!).subscribe(() => {
          this.grid.reset();
          this.messageService.add({
            severity: 'success',
            detail: 'Tipo de locação excluído com sucesso!',
          });
        });
      },
    });
  }

  onSelectionChange(rentalTypes: RentalType[]): void {
    this.selectedRentalTypes = rentalTypes;

    this.rentalTypes.forEach((rentalType) => {
      if (rentalType.id != null) {
        const index = this.selectedRentalTypeIds.indexOf(rentalType.id);

        if (index !== -1) {
          this.selectedRentalTypeIds.splice(index, 1);
        }
      }
    });

    rentalTypes.forEach((rentalType) => {
      if (
        rentalType.id != null &&
        !this.selectedRentalTypeIds.includes(rentalType.id)
      ) {
        this.selectedRentalTypeIds.push(rentalType.id);
      }
    });
  }

  deleteSelectedRentalTypes(): void {
    if (
      !this.selectedRentalTypeIds ||
      this.selectedRentalTypeIds.length === 0
    ) {
      return;
    }

    const ids = [...this.selectedRentalTypeIds];

    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir ${ids.length} tipo(s) de locação?`,
      accept: () => {
        this.rentalTypeService.deleteAll(ids).subscribe(() => {
          this.selectedRentalTypeIds = [];
          this.selectedRentalTypes = [];

          this.grid.reset();

          this.messageService.add({
            severity: 'success',
            detail: 'Tipos de locação excluídos com sucesso!',
          });
        });
      },
    });
  }

  openDetails(rentalType: RentalType): void {
    const id = rentalType.id;

    if (id == null) {
      return;
    }

    this.detailsVisible = true;
    this.rentalTypeDetails = null;

    this.rentalTypeService.findById(id).subscribe({
      next: (details: RentalTypeDTO) => {
        this.rentalTypeDetails = RentalTypeMapper.toModel(details);
      },
    });
  }

  toggleActive(rentalType: RentalType): void {
    if (!rentalType.id) {
      return;
    }

    const newStatus = !rentalType.active;

    this.rentalTypeService.changeActive(rentalType.id, newStatus).subscribe({
      next: () => {
        rentalType.active = newStatus;

        this.messageService.add({
          severity: 'success',
          detail: `Tipo de locação ${newStatus ? 'ativado' : 'desativado'} com sucesso!`,
        });
      },
    });
  }

  openFieldCustomization(): void {
    this.fieldCustomizationVisible = true;
  }

  applyVisibleFields(fields: string[]): void {
    this.visibleFields = [...fields];
  }

  loadRentalTypesForExport = (
    pagination: Pagination,
  ): Observable<PageResponse<RentalTypeDTO>> => {
    return this.rentalTypeService.list(pagination, this.filterName);
  };

  hasAuthority(authority: string): boolean {
    return this.authService.hasAuthority(authority);
  }
}
