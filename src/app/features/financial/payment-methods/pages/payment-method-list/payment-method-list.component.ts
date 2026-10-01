import { Component, ViewChild } from '@angular/core';

import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Pagination } from 'src/app/core/models/Pagination';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';

import { PaymentMethod } from '../../models/PaymentMethod';
import { PaymentMethodService } from '../../services/payment-method.service';
import { PaymentMethodDTO } from '../../dtos/payment-method-dto';
import { PaymentMethodMapper } from '../../mapper/payment-method.mapper';
import { DataTableColumn } from 'src/app/shared/components/data-table/models/data-table-column';
import { Observable } from 'rxjs';
import { PageResponse } from 'src/app/core/models/page-response';

@Component({
  selector: 'app-payment-method-list',
  templateUrl: './payment-method-list.component.html',
  styleUrls: ['./payment-method-list.component.css'],
})
export class PaymentMethodListComponent {
  paymentMethods: PaymentMethod[] = [];

  pagination: Pagination = new Pagination();

  totalElements: number = 0;

  filterName: string = '';

  selectedPaymentMethods: PaymentMethod[] = [];

  selectedPaymentMethodIds: number[] = [];

  loading: boolean = false;

  fieldCustomizationVisible: boolean = false;

  visibleFields: string[] = ['name', 'fee'];

  availableFields: DataTableColumn[] = [
    { field: 'name', label: 'Nome' },
    { field: 'fee', label: 'Taxa' },
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

  @ViewChild('paymentMethodTable') grid!: DataTableComponent;

  detailsVisible = false;

  paymentMethodDetails: PaymentMethod | null = null;

  constructor(
    private paymentMethodService: PaymentMethodService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
  ) {}

  list(page: number = 0): void {
    this.pagination.page = page;
    this.loading = true;

    this.paymentMethodService.list(this.pagination, this.filterName).subscribe({
      next: (data) => {
        this.paymentMethods = [];

        data.content.forEach((dto: PaymentMethodDTO) => {
          const paymentMethod = PaymentMethodMapper.toModel(dto);
          this.paymentMethods.push(paymentMethod);
        });

        this.totalElements = data.totalElements;

        this.selectedPaymentMethods = [];
        this.paymentMethods.forEach((paymentMethod) => {
          if (
            paymentMethod.id != null &&
            this.selectedPaymentMethodIds.includes(paymentMethod.id)
          ) {
            this.selectedPaymentMethods.push(paymentMethod);
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

  searchPaymentMethod(name: string): void {
    this.filterName = name;
    this.list();
  }

  delete(paymentMethod: PaymentMethod): void {
    if (!paymentMethod.id) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.paymentMethodService.delete(paymentMethod.id!).subscribe(() => {
          this.grid.reset();
          this.messageService.add({
            severity: 'success',
            detail: 'Forma de pagamento excluída com sucesso!',
          });
        });
      },
    });
  }

  onSelectionChange(paymentMethods: PaymentMethod[]): void {
    this.selectedPaymentMethods = paymentMethods;

    this.paymentMethods.forEach((paymentMethod) => {
      if (paymentMethod.id != null) {
        const index = this.selectedPaymentMethodIds.indexOf(paymentMethod.id);

        if (index !== -1) {
          this.selectedPaymentMethodIds.splice(index, 1);
        }
      }
    });

    paymentMethods.forEach((paymentMethod) => {
      if (
        paymentMethod.id != null &&
        !this.selectedPaymentMethodIds.includes(paymentMethod.id)
      ) {
        this.selectedPaymentMethodIds.push(paymentMethod.id);
      }
    });
  }

  deleteSelectedPaymentMethods(): void {
    if (
      !this.selectedPaymentMethodIds ||
      this.selectedPaymentMethodIds.length === 0
    ) {
      return;
    }

    const ids = [...this.selectedPaymentMethodIds];

    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir ${ids.length} forma(s) de pagamento?`,
      accept: () => {
        this.paymentMethodService.deleteAll(ids).subscribe(() => {
          this.selectedPaymentMethodIds = [];
          this.selectedPaymentMethods = [];

          this.grid.reset();

          this.messageService.add({
            severity: 'success',
            detail: 'Formas de pagamento excluídas com sucesso!',
          });
        });
      },
    });
  }

  openDetails(paymentMethod: PaymentMethod): void {
    const id = paymentMethod.id;

    if (id == null) {
      return;
    }

    this.detailsVisible = true;
    this.paymentMethodDetails = null;

    this.paymentMethodService.findById(id).subscribe({
      next: (details: PaymentMethodDTO) => {
        this.paymentMethodDetails = PaymentMethodMapper.toModel(details);
      },
    });
  }

  openFieldCustomization(): void {
    this.fieldCustomizationVisible = true;
  }

  applyVisibleFields(fields: string[]): void {
    this.visibleFields = [...fields];
  }

  loadPaymentMethodsForExport = (
    pagination: Pagination,
  ): Observable<PageResponse<PaymentMethodDTO>> => {
    return this.paymentMethodService.list(pagination, this.filterName);
  };

  hasAuthority(authority: string): boolean {
    return this.authService.hasAuthority(authority);
  }
}
