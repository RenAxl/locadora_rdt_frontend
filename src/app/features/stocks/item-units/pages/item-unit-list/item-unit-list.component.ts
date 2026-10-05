import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Pagination } from 'src/app/core/models/Pagination';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';

import { ItemUnit } from '../../models/ItemUnit';
import { ItemUnitService } from '../../services/item-unit.service';
import { ItemUnitDTO } from '../../dtos/item-unit-dto';
import { ItemUnitMapper } from '../../mapper/item-unit.mapper';
import { DataTableColumn } from 'src/app/shared/components/data-table/models/data-table-column';
import { Observable, Subscription } from 'rxjs';
import { PageResponse } from 'src/app/core/models/page-response';

@Component({
  selector: 'app-item-unit-list',
  templateUrl: './item-unit-list.component.html',
  styleUrls: ['./item-unit-list.component.css'],
})
export class ItemUnitListComponent implements OnInit, OnDestroy {
  itemUnits: ItemUnit[] = [];

  itemId?: number;

  pagination: Pagination = new Pagination(0, 5, 'ASC', 'assetCode');

  totalElements: number = 0;

  filterName: string = '';

  selectedItemUnits: ItemUnit[] = [];

  selectedItemUnitIds: number[] = [];

  loading: boolean = false;

  fieldCustomizationVisible: boolean = false;

  visibleFields: string[] = ['item.name', 'assetCode', 'status', 'conditionStatus'];

  availableFields: DataTableColumn[] = [
    { field: 'item.name', label: 'Item' },
    { field: 'assetCode', label: 'Código patrimonial' },
    { field: 'serialNumber', label: 'Número de série' },
    { field: 'status', label: 'Situação' },
    { field: 'conditionStatus', label: 'Conservação' },
    { field: 'purchaseDate', label: 'Data de compra' },
    { field: 'notes', label: 'Observações' },
    { field: 'active', label: 'Ativa' },
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

  @ViewChild('itemUnitTable') grid!: DataTableComponent;

  detailsVisible = false;

  itemUnitDetails: ItemUnit | null = null;

  private routeSubscription?: Subscription;

  constructor(
    private itemUnitService: ItemUnitService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.queryParamMap.subscribe((params) => {
      let itemId = this.route.snapshot.paramMap.get('itemId');

      if (itemId == null) {
        itemId = params.get('itemId');
      }

      this.itemId = undefined;

      if (itemId != null) {
        this.itemId = Number(itemId);
      }

      this.selectedItemUnits = [];
      this.selectedItemUnitIds = [];

      if (this.grid != null) {
        this.grid.reset();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSubscription != null) {
      this.routeSubscription.unsubscribe();
    }
  }

  list(page: number = 0): void {
    this.pagination.page = page;
    this.loading = true;

    this.itemUnitService.list(this.pagination, this.filterName, this.itemId).subscribe({
      next: (data) => {
        this.itemUnits = [];

        data.content.forEach((dto: ItemUnitDTO) => {
          const item = ItemUnitMapper.toModel(dto);
          this.itemUnits.push(item);
        });

        this.totalElements = data.totalElements;

        this.selectedItemUnits = [];
        this.itemUnits.forEach((item) => {
          if (
            item.id != null &&
            this.selectedItemUnitIds.includes(item.id)
          ) {
            this.selectedItemUnits.push(item);
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

  searchItemUnit(name: string): void {
    this.filterName = name;
    this.list();
  }

  delete(item: ItemUnit): void {
    if (!item.id) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.itemUnitService.delete(item.id!).subscribe(() => {
          this.grid.reset();
          this.messageService.add({
            severity: 'success',
            detail: 'Unidade física excluída com sucesso!',
          });
        });
      },
    });
  }

  onSelectionChange(items: ItemUnit[]): void {
    this.selectedItemUnits = items;

    this.itemUnits.forEach((item) => {
      if (item.id != null) {
        const index = this.selectedItemUnitIds.indexOf(item.id);

        if (index !== -1) {
          this.selectedItemUnitIds.splice(index, 1);
        }
      }
    });

    items.forEach((item) => {
      if (
        item.id != null &&
        !this.selectedItemUnitIds.includes(item.id)
      ) {
        this.selectedItemUnitIds.push(item.id);
      }
    });
  }

  deleteSelectedItemUnits(): void {
    if (!this.selectedItemUnitIds || this.selectedItemUnitIds.length === 0) {
      return;
    }

    const ids = [...this.selectedItemUnitIds];

    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir ${ids.length} unidade(s)?`,
      accept: () => {
        this.itemUnitService.deleteAll(ids).subscribe(() => {
          this.selectedItemUnitIds = [];
          this.selectedItemUnits = [];

          this.grid.reset();

          this.messageService.add({
            severity: 'success',
            detail: 'Unidades físicas excluídas com sucesso!',
          });
        });
      },
    });
  }

  openDetails(item: ItemUnit): void {
    const id = item.id;

    if (id == null) {
      return;
    }

    this.detailsVisible = true;
    this.itemUnitDetails = null;

    this.itemUnitService.findById(id).subscribe({
      next: (details: ItemUnitDTO) => {
        this.itemUnitDetails = ItemUnitMapper.toModel(details);
      },
    });
  }

  toggleActive(item: ItemUnit): void {
    if (!item.id) {
      return;
    }

    const newStatus = !item.active;

    this.itemUnitService.changeActive(item.id, newStatus).subscribe({
      next: () => {
        item.active = newStatus;

        this.messageService.add({
          severity: 'success',
          detail: `Unidade física ${newStatus ? 'ativada' : 'desativada'} com sucesso!`,
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

  loadItemUnitsForExport = (
    pagination: Pagination,
  ): Observable<PageResponse<ItemUnitDTO>> => {
    return this.itemUnitService.list(pagination, this.filterName, this.itemId);
  };

  hasAuthority(authority: string): boolean {
    return this.authService.hasAuthority(authority);
  }

  getStatusLabel(status: string): string {
    if (status === 'AVAILABLE') {
      return 'Disponível';
    }

    if (status === 'RESERVED') {
      return 'Reservada';
    }

    if (status === 'RENTED') {
      return 'Alugada';
    }

    if (status === 'MAINTENANCE') {
      return 'Em manutenção';
    }

    return status;
  }

  getConditionLabel(condition: string): string {
    if (condition === 'NEW') {
      return 'Nova';
    }

    if (condition === 'GOOD') {
      return 'Boa';
    }

    if (condition === 'DAMAGED') {
      return 'Danificada';
    }

    return condition;
  }
}
