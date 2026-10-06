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
import { ITEM_UNIT_STATUSES, getItemUnitAvailabilityLabel, getItemUnitConditionLabel } from '../../constants/item-unit-options';
import { ItemUnitService } from '../../services/item-unit.service';
import { ItemUnitDTO } from '../../dtos/item-unit-dto';
import { ItemUnitMapper } from '../../mapper/item-unit.mapper';
import { DataTableColumn } from 'src/app/shared/components/data-table/models/data-table-column';
import { map, Observable, Subscription } from 'rxjs';
import { PageResponse } from 'src/app/core/models/page-response';
import { ItemUnitStatusUpdateDTO } from '../../dtos/item-unit-status-update-dto';

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

  filterActive: boolean | undefined = true;

  selectedItemUnits: ItemUnit[] = [];

  selectedItemUnitIds: number[] = [];

  loading: boolean = false;

  fieldCustomizationVisible: boolean = false;

  visibleFields: string[] = ['item.name', 'assetCode', 'status', 'conditionStatus'];

  availableFields: DataTableColumn[] = [
    { field: 'item.name', label: 'Item' },
    { field: 'assetCode', label: 'Código patrimonial' },
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

  statusDialogVisible = false;
  statusUnit: ItemUnit | null = null;
  statusUpdate = new ItemUnitStatusUpdateDTO();
  statuses = ITEM_UNIT_STATUSES;
  savingStatus = false;

  canSelectUnit = (event: { data: ItemUnit }): boolean => event.data.active;

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

    this.itemUnitService.list(this.pagination, this.filterName, this.itemId, this.filterActive).subscribe({
      next: (data) => {
        this.itemUnits = [];

        data.content.forEach((dto: ItemUnitDTO) => {
          const item = ItemUnitMapper.toModel(dto);
          this.itemUnits.push(item);
        });

        this.totalElements = data.totalElements;

        this.selectedItemUnits = [];
        this.itemUnits.forEach((item) => {
          if (!item.active) {
            this.selectedItemUnitIds = this.selectedItemUnitIds.filter(id => id !== item.id);
          }

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

  changeActiveFilter(): void {
    this.selectedItemUnits = [];
    this.selectedItemUnitIds = [];
    this.grid.reset();
  }

  retireUnit(item: ItemUnit): void {
    if (!item.id || !item.active) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Dar baixa definitiva nesta unidade? Ela ficará inativa e seu histórico será preservado.',
      accept: () => {
        this.itemUnitService.delete(item.id!).subscribe(() => {
          this.selectedItemUnitIds = [];
          this.selectedItemUnits = [];
          this.grid.reset();
          this.messageService.add({
            severity: 'success',
            detail: 'Baixa da unidade física registrada!',
          });
        });
      },
    });
  }

  onSelectionChange(items: ItemUnit[]): void {
    this.selectedItemUnits = items.filter(item => item.active);

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
        item.active &&
        !this.selectedItemUnitIds.includes(item.id)
      ) {
        this.selectedItemUnitIds.push(item.id);
      }
    });
  }

  retireSelectedUnits(): void {
    if (!this.selectedItemUnitIds || this.selectedItemUnitIds.length === 0) {
      return;
    }

    const ids = [...this.selectedItemUnitIds];

    this.confirmationService.confirm({
      message: `Dar baixa definitiva em ${ids.length} unidade(s)? Elas ficarão inativas e seus históricos serão preservados.`,
      accept: () => {
        this.itemUnitService.deleteAll(ids).subscribe(() => {
          this.selectedItemUnitIds = [];
          this.selectedItemUnits = [];

          this.grid.reset();

          this.messageService.add({
            severity: 'success',
            detail: 'Baixa das unidades físicas registrada!',
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

  reactivate(item: ItemUnit): void {
    if (!item.id || item.active || item.item?.active === false || item.item?.category?.active === false) {
      return;
    }

    this.itemUnitService.changeActive(item.id, true).subscribe({
      next: () => {
        this.grid.reset();

        this.messageService.add({
          severity: 'success',
          detail: 'Reentrada da unidade física registrada!',
        });
      },
    });
  }

  openFieldCustomization(): void {
    this.fieldCustomizationVisible = true;
  }

  openStatusChange(unit: ItemUnit): void {
    if (unit.id == null || !unit.active) {
      return;
    }

    this.statusUnit = unit;
    this.statusUpdate = new ItemUnitStatusUpdateDTO({ status: unit.status, reason: '' });
    this.statusDialogVisible = true;
  }

  updateStatus(): void {
    if (this.statusUnit?.id == null || !this.statusUnit.active || this.savingStatus) {
      return;
    }

    if (!this.statuses.some(option => option.value === this.statusUpdate.status)) {
      this.messageService.add({ severity: 'warn', detail: 'Selecione uma situação válida.' });
      return;
    }

    if ((this.statusUpdate.reason || '').length > 255) {
      this.messageService.add({ severity: 'warn', detail: 'O motivo deve ter até 255 caracteres.' });
      return;
    }

    if (this.statusUpdate.status === this.statusUnit.status) {
      return;
    }

    this.savingStatus = true;
    this.itemUnitService.updateStatus(this.statusUnit.id, this.statusUpdate).subscribe({
      next: () => {
        this.savingStatus = false;
        this.statusDialogVisible = false;
        this.list(this.pagination.page);
        this.messageService.add({ severity: 'success', detail: 'Situação da unidade atualizada!' });
      },
      error: () => {
        this.savingStatus = false;
      },
    });
  }

  applyVisibleFields(fields: string[]): void {
    this.visibleFields = [...fields];
  }

  loadItemUnitsForExport = (
    pagination: Pagination,
  ): Observable<PageResponse<ItemUnitDTO>> => {
    return this.itemUnitService.list(pagination, this.filterName, this.itemId, this.filterActive).pipe(
      map(data => {
        const content: ItemUnitDTO[] = [];

        for (const dto of data.content) {
          const unit = ItemUnitMapper.toModel(dto);
          content.push({
            ...dto,
            status: this.getStatusLabel(unit),
            conditionStatus: this.getConditionLabel(unit.conditionStatus),
          });
        }

        return { content, totalElements: data.totalElements };
      }),
    );
  };

  hasAuthority(authority: string): boolean {
    return this.authService.hasAuthority(authority);
  }

  getStatusLabel(unit: ItemUnit): string {
    return getItemUnitAvailabilityLabel(unit);
  }

  getConditionLabel(condition: string): string {
    return getItemUnitConditionLabel(condition);
  }
}
