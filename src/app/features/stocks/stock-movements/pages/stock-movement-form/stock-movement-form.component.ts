import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Pagination } from 'src/app/core/models/Pagination';
import { StockMovementService } from '../../services/stock-movement.service';
import { StockMovementMapper } from '../../mapper/stock-movement.mapper';
import { StockMovement } from '../../models/StockMovement';
import { ItemService } from '../../../items/services/item.service';
import { ItemMapper } from '../../../items/mapper/item.mapper';
import { Item } from '../../../items/models/Item';
import { ItemDTO } from '../../../items/dtos/item-dto';
import { Subscription } from 'rxjs';
import { ItemUnit } from '../../../item-units/models/ItemUnit';
import { ItemUnitMapper } from '../../../item-units/mapper/item-unit.mapper';
import { ItemUnitService } from '../../../item-units/services/item-unit.service';
import { ITEM_UNIT_STATUSES, getItemUnitAvailabilityLabel } from '../../../item-units/constants/item-unit-options';
import { AuthService } from 'src/app/core/auth/services/auth.service';

@Component({
  selector: 'app-stock-movement-form',
  templateUrl: './stock-movement-form.component.html',
  styleUrls: ['./stock-movement-form.component.css'],
})
export class StockMovementFormComponent implements OnInit, OnDestroy {
  stockMovement: StockMovement = new StockMovement();

  items: Item[] = [];

  itemUnits: ItemUnit[] = [];
  statuses = ITEM_UNIT_STATUSES;
  loadingUnits = false;
  saving = false;
  private unitsSubscription?: Subscription;

  movementTypes = [
    { value: 'ENTRY', label: 'Entrada' },
    { value: 'EXIT', label: 'Saída definitiva' },
    { value: 'ADJUSTMENT', label: 'Ajuste' },
    { value: 'STATUS_CHANGE', label: 'Alteração de situação' },
  ];

  constructor(
    private stockMovementService: StockMovementService,
    private messageService: MessageService,
    private router: Router,
    private itemService: ItemService,
    private itemUnitService: ItemUnitService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadItems();
  }

  ngOnDestroy(): void {
    this.unitsSubscription?.unsubscribe();
  }

  changeSelection(): void {
    this.stockMovement.itemUnitId = null;
    this.stockMovement.status = null;

    if (this.stockMovement.type === 'STATUS_CHANGE') {
      this.stockMovement.quantity = 1;
    }

    this.loadItemUnits();
  }

  loadItemUnits(page: number = 0): void {
    if (page === 0) {
      this.unitsSubscription?.unsubscribe();
      this.itemUnits = [];
      this.loadingUnits = false;
    }

    const itemId = this.stockMovement.itemId;
    const type = this.stockMovement.type;

    if (itemId == null || (type !== 'EXIT' && type !== 'STATUS_CHANGE') || !this.canReadUnits()) {
      return;
    }

    this.loadingUnits = true;
    const pagination = new Pagination(page, 1000, 'ASC', 'assetCode');

    this.unitsSubscription = this.itemUnitService.list(pagination, '', itemId).subscribe({
      next: (data) => {
        for (const dto of data.content) {
          const unit = ItemUnitMapper.toModel(dto);

          if (!unit.active) {
            continue;
          }

          if (type === 'EXIT' && (unit.status !== 'AVAILABLE' ||
              unit.item?.active === false || unit.item?.category?.active === false)) {
            continue;
          }

          this.itemUnits.push(unit);
        }

        if ((page + 1) * pagination.linesPerPage < data.totalElements) {
          this.loadItemUnits(page + 1);
        } else {
          this.loadingUnits = false;
        }
      },
      error: () => {
        this.itemUnits = [];
        this.loadingUnits = false;
      },
    });
  }

  changeUnit(): void {
    this.stockMovement.status = null;

    if (this.stockMovement.itemUnitId != null) {
      this.stockMovement.quantity = 1;
    }
  }

  getSelectedUnit(): ItemUnit | undefined {
    return this.itemUnits.find(unit => unit.id === this.stockMovement.itemUnitId);
  }

  getStatusLabel(unit: ItemUnit): string {
    return getItemUnitAvailabilityLabel(unit);
  }

  canReadUnits(): boolean {
    return this.authService.hasAuthority('ITEM_UNIT_READ');
  }

  loadItems(page: number = 0): void {
    if (page === 0) {
      this.items = [];
    }

    const pagination = new Pagination(page, 1000, 'ASC', 'name');

    this.itemService.list(pagination, '').subscribe({
      next: (data) => {
        data.content.forEach((dto: ItemDTO) => {
          const item = ItemMapper.toModel(dto);
          this.items.push(item);
        });

        if ((page + 1) * pagination.linesPerPage < data.totalElements) {
          this.loadItems(page + 1);
        }
      },
      error: () => {
        this.items = [];
      },
    });
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.insert();
  }

  insert(): void {
    if (this.saving || this.loadingUnits) {
      return;
    }

    if (!this.validateMovement()) {
      return;
    }

    const stockMovementToInsert = StockMovementMapper.toInsertDTO(this.stockMovement);

    this.saving = true;
    this.stockMovementService.insert(stockMovementToInsert).subscribe({
      next: (data) => {
        this.saving = false;
        this.stockMovement = StockMovementMapper.toModel(data);
        this.finish();
      },
      error: () => {
        this.saving = false;
      },
    });
  }

  private validateMovement(): boolean {
    if (this.stockMovement.itemId == null) {
      this.messageService.add({ severity: 'warn', detail: 'Selecione um item.' });
      return false;
    }

    if (!this.movementTypes.some(type => type.value === this.stockMovement.type)) {
      this.messageService.add({ severity: 'warn', detail: 'Selecione um tipo de movimentação válido.' });
      return false;
    }

    const item = this.items.find(item => item.id === this.stockMovement.itemId);

    if ((this.stockMovement.type === 'ENTRY' || this.stockMovement.type === 'EXIT') &&
        item != null && (!item.active || item.category?.active === false)) {
      this.messageService.add({ severity: 'warn', detail: 'Entradas e saídas exigem item e categoria ativos.' });
      return false;
    }

    const quantity = this.stockMovement.quantity;
    const minimum = this.stockMovement.type === 'ADJUSTMENT' ? 0 : 1;

    if (quantity == null || !Number.isInteger(quantity) || quantity < minimum) {
      this.messageService.add({
        severity: 'warn',
        detail: `Informe uma quantidade inteira maior ou igual a ${minimum}.`,
      });
      return false;
    }

    if ((this.stockMovement.reason || '').length > 255) {
      this.messageService.add({ severity: 'warn', detail: 'O motivo deve ter até 255 caracteres.' });
      return false;
    }

    return this.validateUnit();
  }

  private validateUnit(): boolean {
    const quantity = this.stockMovement.quantity;
    const unit = this.getSelectedUnit();

    if (this.stockMovement.type === 'STATUS_CHANGE') {
      if (unit == null || !unit.active || quantity !== 1) {
        this.messageService.add({ severity: 'warn', detail: 'Selecione uma unidade ativa e informe quantidade 1.' });
        return false;
      }

      if (!this.statuses.some(status => status.value === this.stockMovement.status)) {
        this.messageService.add({ severity: 'warn', detail: 'Selecione a nova situação.' });
        return false;
      }

      if (unit.status === this.stockMovement.status) {
        this.messageService.add({ severity: 'warn', detail: 'Selecione uma situação diferente da atual.' });
        return false;
      }
    }

    if (this.stockMovement.type === 'EXIT' && this.stockMovement.itemUnitId != null &&
        (unit == null || !unit.active || unit.status !== 'AVAILABLE' ||
         unit.item?.active === false || unit.item?.category?.active === false || quantity !== 1)) {
      this.messageService.add({ severity: 'warn', detail: 'A saída de uma unidade específica exige uma unidade disponível e quantidade 1.' });
      return false;
    }

    if ((this.stockMovement.type === 'ENTRY' || this.stockMovement.type === 'ADJUSTMENT') &&
        this.stockMovement.itemUnitId != null) {
      this.messageService.add({ severity: 'warn', detail: 'Entradas e ajustes não selecionam uma unidade existente.' });
      return false;
    }

    if (this.stockMovement.type !== 'STATUS_CHANGE' && this.stockMovement.status != null) {
      this.messageService.add({ severity: 'warn', detail: 'Selecione uma nova situação apenas em Alteração de situação.' });
      return false;
    }

    return true;
  }

  finish(): void {
    this.router.navigate(['/stock-movements/']);

    this.messageService.add({
      severity: 'success',
      detail: 'Movimentação registrada com sucesso!',
    });
  }
}
