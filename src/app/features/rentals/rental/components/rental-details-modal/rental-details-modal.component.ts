import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DataTableColumn } from 'src/app/shared/components/data-table/models/data-table-column';
import { RentalItemUnitMapper } from '../../mapper/rental-item-unit.mapper';
import { RentalStatusHistoryMapper } from '../../mapper/rental-status-history.mapper';
import { Rental } from '../../models/Rental';
import { RentalItemUnit } from '../../models/RentalItemUnit';
import { RentalStatusHistory } from '../../models/RentalStatusHistory';
import { RentalService } from '../../services/rental.service';

@Component({
  selector: 'app-rental-details-modal',
  templateUrl: './rental-details-modal.component.html',
  styleUrls: ['./rental-details-modal.component.css'],
})
export class RentalDetailsModalComponent implements OnChanges, OnDestroy {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() title = 'Detalhamento da Locação';
  @Input() rental: Rental | null = null;

  units: RentalItemUnit[] = [];
  history: RentalStatusHistory[] = [];

  loadingUnits: boolean = false;
  loadingHistory: boolean = false;

  itemColumns: DataTableColumn[] = [
    { field: 'itemName', label: 'Item' },
    { field: 'quantity', label: 'Quantidade' },
    { field: 'unitPrice', label: 'Preço' },
    { field: 'discount', label: 'Desconto' },
    { field: 'additionalFee', label: 'Acréscimo' },
    { field: 'subtotal', label: 'Subtotal' },
  ];

  unitColumns: DataTableColumn[] = [
    { field: 'itemName', label: 'Item' },
    { field: 'assetCode', label: 'Código patrimonial' },
    { field: 'status', label: 'Status' },
    { field: 'reservedAt', label: 'Reserva' },
    { field: 'deliveredAt', label: 'Entrega' },
    { field: 'returnedAt', label: 'Devolução efetiva' },
  ];

  historyColumns: DataTableColumn[] = [
    { field: 'changedAt', label: 'Data' },
    { field: 'previousStatus', label: 'Status anterior' },
    { field: 'newStatus', label: 'Novo status' },
    { field: 'reason', label: 'Motivo' },
    { field: 'changedBy', label: 'Responsável' },
  ];

  private unitsSubscription?: Subscription;
  private historySubscription?: Subscription;

  constructor(private rentalService: RentalService) {}

  ngOnChanges(changes: SimpleChanges): void {
    const rentalChanged = changes['rental'] !== undefined;
    const visibleChanged = changes['visible'] !== undefined;

    if (rentalChanged || visibleChanged) {
      this.clearDetails();

      if (this.visible) {
        this.loadUnits();
        this.loadHistory();
      }
    }
  }

  ngOnDestroy(): void {
    this.clearDetails();
  }

  close(): void {
    this.visibleChange.emit(false);
    this.clearDetails();
  }

  loadUnits(): void {
    if (this.rental == null || this.rental.id == null) {
      return;
    }

    this.loadingUnits = true;
    this.unitsSubscription = this.rentalService.findRentalUnits(this.rental.id).subscribe({
      next: (data) => {
        this.units = [];

        for (const dto of data) {
          this.units.push(RentalItemUnitMapper.toModel(dto));
        }

        this.loadingUnits = false;
      },
      error: () => {
        this.loadingUnits = false;
      },
    });
  }

  loadHistory(): void {
    if (this.rental == null || this.rental.id == null) {
      return;
    }

    this.loadingHistory = true;
    this.historySubscription = this.rentalService.findHistory(this.rental.id).subscribe({
      next: (data) => {
        this.history = [];

        for (const dto of data) {
          this.history.push(RentalStatusHistoryMapper.toModel(dto));
        }

        this.loadingHistory = false;
      },
      error: () => {
        this.loadingHistory = false;
      },
    });
  }

  getStatusLabel(status?: string): string {
    if (status === 'RENTED') {
      return 'Alugada';
    }

    if (status === 'RESERVED') {
      return 'Reservada';
    }

    if (status === 'DELIVERED') {
      return 'Entregue';
    }

    if (status === 'RETURNED') {
      return 'Devolvida';
    }

    return status || '-';
  }

  private clearDetails(): void {
    if (this.unitsSubscription != null) {
      this.unitsSubscription.unsubscribe();
      this.unitsSubscription = undefined;
    }

    if (this.historySubscription != null) {
      this.historySubscription.unsubscribe();
      this.historySubscription = undefined;
    }

    this.units = [];
    this.history = [];
    this.loadingUnits = false;
    this.loadingHistory = false;
  }
}
