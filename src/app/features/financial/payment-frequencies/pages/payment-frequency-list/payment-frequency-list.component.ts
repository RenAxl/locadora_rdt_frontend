import { Component, ViewChild } from '@angular/core';

import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Pagination } from 'src/app/core/models/Pagination';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';

import { PaymentFrequency } from '../../models/PaymentFrequency';
import { PaymentFrequencyService } from '../../services/payment-frequency.service';
import { PaymentFrequencyDTO } from '../../dtos/payment-frequency-dto';
import { PaymentFrequencyMapper } from '../../mapper/payment-frequency.mapper';
import { DataTableColumn } from 'src/app/shared/components/data-table/models/data-table-column';
import { Observable } from 'rxjs';
import { PageResponse } from 'src/app/core/models/page-response';

@Component({
  selector: 'app-payment-frequency-list',
  templateUrl: './payment-frequency-list.component.html',
  styleUrls: ['./payment-frequency-list.component.css'],
})
export class PaymentFrequencyListComponent {
  paymentFrequencies: PaymentFrequency[] = [];

  pagination: Pagination = new Pagination(0, 5, 'ASC', 'frequency');

  totalElements: number = 0;

  filterFrequency: string = '';

  selectedPaymentFrequencies: PaymentFrequency[] = [];

  selectedPaymentFrequencyIds: number[] = [];

  loading: boolean = false;

  fieldCustomizationVisible: boolean = false;

  visibleFields: string[] = ['frequency', 'days'];

  availableFields: DataTableColumn[] = [
    { field: 'frequency', label: 'Frequência' },
    { field: 'days', label: 'Dias' },
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

  @ViewChild('paymentFrequencyTable') grid!: DataTableComponent;

  detailsVisible = false;

  paymentFrequencyDetails: PaymentFrequency | null = null;

  constructor(
    private paymentFrequencyService: PaymentFrequencyService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
  ) {}

  list(page: number = 0): void {
    this.pagination.page = page;
    this.loading = true;

    this.paymentFrequencyService
      .list(this.pagination, this.filterFrequency)
      .subscribe({
        next: (data) => {
          this.paymentFrequencies = [];

          data.content.forEach((dto: PaymentFrequencyDTO) => {
            const paymentFrequency = PaymentFrequencyMapper.toModel(dto);
            this.paymentFrequencies.push(paymentFrequency);
          });

          this.totalElements = data.totalElements;

          this.selectedPaymentFrequencies = [];
          this.paymentFrequencies.forEach((paymentFrequency) => {
            if (
              paymentFrequency.id != null &&
              this.selectedPaymentFrequencyIds.includes(paymentFrequency.id)
            ) {
              this.selectedPaymentFrequencies.push(paymentFrequency);
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

  searchPaymentFrequency(frequency: string): void {
    this.filterFrequency = frequency;
    this.list();
  }

  delete(paymentFrequency: PaymentFrequency): void {
    if (!paymentFrequency.id) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.paymentFrequencyService.delete(paymentFrequency.id!).subscribe(() => {
          this.grid.reset();
          this.messageService.add({
            severity: 'success',
            detail: 'Frequência de pagamento excluída com sucesso!',
          });
        });
      },
    });
  }

  onSelectionChange(paymentFrequencies: PaymentFrequency[]): void {
    this.selectedPaymentFrequencies = paymentFrequencies;

    this.paymentFrequencies.forEach((paymentFrequency) => {
      if (paymentFrequency.id != null) {
        const index = this.selectedPaymentFrequencyIds.indexOf(
          paymentFrequency.id,
        );

        if (index !== -1) {
          this.selectedPaymentFrequencyIds.splice(index, 1);
        }
      }
    });

    paymentFrequencies.forEach((paymentFrequency) => {
      if (
        paymentFrequency.id != null &&
        !this.selectedPaymentFrequencyIds.includes(paymentFrequency.id)
      ) {
        this.selectedPaymentFrequencyIds.push(paymentFrequency.id);
      }
    });
  }

  deleteSelectedPaymentFrequencies(): void {
    if (
      !this.selectedPaymentFrequencyIds ||
      this.selectedPaymentFrequencyIds.length === 0
    ) {
      return;
    }

    const ids = [...this.selectedPaymentFrequencyIds];

    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir ${ids.length} frequência(s) de pagamento?`,
      accept: () => {
        this.paymentFrequencyService.deleteAll(ids).subscribe(() => {
          this.selectedPaymentFrequencyIds = [];
          this.selectedPaymentFrequencies = [];

          this.grid.reset();

          this.messageService.add({
            severity: 'success',
            detail: 'Frequências de pagamento excluídas com sucesso!',
          });
        });
      },
    });
  }

  openDetails(paymentFrequency: PaymentFrequency): void {
    const id = paymentFrequency.id;

    if (id == null) {
      return;
    }

    this.detailsVisible = true;
    this.paymentFrequencyDetails = null;

    this.paymentFrequencyService.findById(id).subscribe({
      next: (details: PaymentFrequencyDTO) => {
        this.paymentFrequencyDetails = PaymentFrequencyMapper.toModel(details);
      },
    });
  }

  openFieldCustomization(): void {
    this.fieldCustomizationVisible = true;
  }

  applyVisibleFields(fields: string[]): void {
    this.visibleFields = [...fields];
  }

  loadPaymentFrequenciesForExport = (
    pagination: Pagination,
  ): Observable<PageResponse<PaymentFrequencyDTO>> => {
    return this.paymentFrequencyService.list(pagination, this.filterFrequency);
  };

  hasAuthority(authority: string): boolean {
    return this.authService.hasAuthority(authority);
  }
}
