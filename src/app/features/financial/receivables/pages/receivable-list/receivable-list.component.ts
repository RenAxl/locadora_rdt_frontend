import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { map, Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Pagination } from 'src/app/core/models/Pagination';
import { PageResponse } from 'src/app/core/models/page-response';
import { CustomizableField } from 'src/app/shared/models/customizable-field';
import { ReceivableDTO } from '../../dtos/receivable-dto';
import { ReceivablePaymentDTO } from '../../dtos/receivable-payment-dto';
import { ReceivableMapper } from '../../mapper/receivable.mapper';
import { Receivable } from '../../models/Receivable';
import { ReceivableFilters } from '../../models/ReceivableFilters';
import { ReceivableService } from '../../services/receivable.service';

@Component({
  selector: 'app-receivable-list',
  templateUrl: './receivable-list.component.html',
  styleUrls: ['./receivable-list.component.css'],
})
export class ReceivableListComponent implements OnInit {
  receivables: Receivable[] = [];

  pagination: Pagination = new Pagination(0, 10, 'ASC', 'dueDate');

  totalElements: number = 0;

  filters: ReceivableFilters = new ReceivableFilters();

  loading: boolean = false;

  fieldCustomizationVisible: boolean = false;

  visibleFields: string[] = [
    'description',
    'customerName',
    'originalAmount',
    'paymentMethodName',
    'paymentFrequency',
    'status',
    'currentAmountWithLateCharges',
    'subtotal',
    'dueDate',
    'paymentDate',
    'remainingBalance',
    'fee',
    'lateInterest',
    'lateFee',
    'discount',
    'createdByName',
    'createdAt',
    'updatedByName',
    'updatedAt',
    'paidByName',
    'note',
  ];

  availableFields: CustomizableField[] = [
    { field: 'description', label: 'Descrição' },
    { field: 'customerName', label: 'Cliente' },
    { field: 'paymentMethodName', label: 'Forma de recebimento' },
    { field: 'paymentFrequency', label: 'Frequência' },
    { field: 'status', label: 'Situação' },
    { field: 'originalAmount', label: 'Valor original' },
    { field: 'currentAmountWithLateCharges', label: 'Valor atual' },
    { field: 'subtotal', label: 'Valor recebido' },
    { field: 'dueDate', label: 'Vencimento' },
    { field: 'paymentDate', label: 'Recebimento' },
    { field: 'remainingBalance', label: 'Saldo' },
    { field: 'fee', label: 'Taxa' },
    { field: 'lateInterest', label: 'Juros' },
    { field: 'lateFee', label: 'Multa' },
    { field: 'discount', label: 'Desconto' },
    { field: 'createdByName', label: 'Criado por' },
    { field: 'createdAt', label: 'Data cadastro' },
    { field: 'updatedByName', label: 'Atualizado por' },
    { field: 'updatedAt', label: 'Data atualização' },
    { field: 'paidByName', label: 'Recebido por' },
    { field: 'note', label: 'Observação' },
  ];

  get visibleCardFields(): CustomizableField[] {
    const fields: CustomizableField[] = [];

    for (const field of this.availableFields) {
      if (this.visibleFields.includes(field.field)) {
        fields.push(field);
      }
    }

    return fields;
  }

  detailsVisible: boolean = false;
  receivableDetails: Receivable | null = null;

  overdueVisible: boolean = false;
  overdueReceivable: Receivable | null = null;

  paymentChoiceVisible: boolean = false;
  paymentEditChargesVisible: boolean = false;
  paymentModalVisible: boolean = false;
  paymentReceivable: Receivable | null = null;
  paymentCharges: { lateFee: number; lateInterest: number } = {
    lateFee: 0,
    lateInterest: 0,
  };

  filesVisible: boolean = false;
  selectedReceivableId?: number;
  selectedReceivableDescription?: string;

  constructor(
    private receivableService: ReceivableService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadVisibleFields();
    this.list();
  }

  list(page: number = 0): void {
    this.pagination.page = page;
    this.loading = true;

    this.receivableService.list(this.pagination, this.filters).subscribe({
      next: (data) => {
        this.receivables = [];

        data.content.forEach((dto: ReceivableDTO) => {
          const receivable = ReceivableMapper.toModel(dto);
          receivable.status = this.getStatusLabel(receivable);
          this.receivables.push(receivable);
        });

        this.totalElements = data.totalElements;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  changePage(event: { page: number; rows: number }): void {
    this.pagination.linesPerPage = event.rows;
    this.list(event.page);
  }

  applyFilters(filters: ReceivableFilters): void {
    this.filters = filters;
    this.pagination.orderBy = filters.orderBy || this.pagination.orderBy;
    this.pagination.direction = filters.direction || this.pagination.direction;
    this.list(0);
  }

  clearFilters(): void {
    this.filters = new ReceivableFilters();
    this.pagination.orderBy = 'dueDate';
    this.pagination.direction = 'ASC';
    this.list(0);
  }

  delete(receivable: Receivable): void {
    if (!receivable.id) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.receivableService.delete(receivable.id!).subscribe(() => {
          this.list(this.pagination.page);
          this.messageService.add({
            severity: 'success',
            detail: 'Conta excluída com sucesso!',
          });
        });
      },
    });
  }

  pay(receivable: Receivable): void {
    const amount = this.getReceivableOpenAmount(receivable);
    if (!receivable.id) {
      return;
    }

    if (amount <= 0) {
      this.messageService.add({
        severity: 'warn',
        detail: 'Esta conta não possui saldo para baixa.',
      });
      return;
    }

    this.paymentReceivable = receivable;
    this.paymentCharges = this.getDefaultCharges(receivable);

    if (this.isOverdueOpenReceivable(receivable)) {
      this.paymentChoiceVisible = true;
      return;
    }

    this.paymentModalVisible = true;
  }

  getReceivableOpenAmount(receivable: Receivable): number {
    if (receivable.paid) {
      return 0;
    }

    const amount = Number(receivable.amount ?? 0);
    let paidAmount = 0;

    if (receivable.paid || receivable.paymentDate) {
      paidAmount = Number(receivable.subtotal ?? 0);
    }

    if (amount > 0 && paidAmount >= amount) {
      return 0;
    }

    if (amount > 0 && paidAmount > 0 && paidAmount < amount) {
      return Math.round((amount - paidAmount) * 100) / 100;
    }

    const remaining = receivable.remainingBalance;

    if (remaining != null && remaining > 0 && remaining < amount) {
      return Number(remaining);
    }

    return amount;
  }

  useDefaultPaymentCharges(): void {
    if (!this.paymentReceivable) {
      return;
    }

    this.paymentCharges = this.getDefaultCharges(this.paymentReceivable);
    this.paymentChoiceVisible = false;
    this.paymentModalVisible = true;
  }

  editPaymentCharges(): void {
    if (
      !this.paymentReceivable ||
      !this.isOverdueOpenReceivable(this.paymentReceivable)
    ) {
      return;
    }

    this.paymentChoiceVisible = false;
    this.paymentEditChargesVisible = true;
  }

  finishPaymentChargesEdit(charges: {
    lateFee: number;
    lateInterest: number;
  }): void {
    if (
      !this.paymentReceivable ||
      !this.isOverdueOpenReceivable(this.paymentReceivable)
    ) {
      return;
    }

    this.paymentCharges = charges;
    this.paymentEditChargesVisible = false;
    this.paymentModalVisible = true;
  }

  submitPayment(dto: ReceivablePaymentDTO): void {
    if (this.paymentReceivable == null || this.paymentReceivable.id == null) {
      return;
    }

    this.receivableService.pay(this.paymentReceivable.id, dto).subscribe({
      next: () => {
        this.paymentModalVisible = false;
        this.paymentReceivable = null;
        this.list(this.pagination.page);
        this.messageService.add({
          severity: 'success',
          detail: 'Baixa registrada!',
        });
      },
    });
  }

  isOverdueOpenReceivable(receivable: Receivable): boolean {
    if (receivable.paid || receivable.canceled || !receivable.dueDate) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(receivable.dueDate + 'T00:00:00');
    dueDate.setHours(0, 0, 0, 0);

    return (
      dueDate.getTime() < today.getTime() &&
      this.getReceivableOpenAmount(receivable) > 0
    );
  }

  openDetails(receivable: Receivable): void {
    if (!receivable.id) {
      return;
    }

    this.detailsVisible = true;
    this.receivableDetails = null;

    this.receivableService.findById(receivable.id).subscribe({
      next: (details) => {
        this.receivableDetails = ReceivableMapper.toModel(details);
      },
    });
  }

  generateReceipt(receivable: Receivable): void {
    if (!receivable.id) {
      return;
    }

    this.receivableService.receipt(receivable.id).subscribe((pdf) => {
      const blob = new Blob([pdf], { type: 'application/pdf' });
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl, '_blank');

      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 60000);
    });
  }

  generateFiscalCoupon(receivable: Receivable): void {
    if (!receivable.id) {
      return;
    }

    this.receivableService.fiscalCoupon(receivable.id).subscribe((pdf) => {
      const blob = new Blob([pdf], { type: 'application/pdf' });
      const objectUrl = URL.createObjectURL(blob);
      window.open(objectUrl, '_blank');

      setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 60000);
    });
  }

  openOverdueDetails(receivable: Receivable): void {
    this.overdueReceivable = receivable;
    this.overdueVisible = true;
  }

  openFilesModal(receivable: Receivable): void {
    this.selectedReceivableId = receivable.id;
    this.selectedReceivableDescription = receivable.description;
    this.filesVisible = true;
  }

  getPaidAmount(receivable: Receivable): number {
    const amount = Number(receivable.amount ?? 0);

    if (receivable.paid) {
      return Number(
        receivable.currentAmountWithLateCharges ?? receivable.subtotal ?? amount,
      );
    }

    if (
      (receivable.paid || receivable.paymentDate) &&
      receivable.subtotal != null &&
      receivable.subtotal > 0
    ) {
      if (amount > 0) {
        return Math.min(Number(receivable.subtotal), amount);
      }

      return Number(receivable.subtotal);
    }

    if (this.isPartiallyPaid(receivable)) {
      return amount - this.getReceivableOpenAmount(receivable);
    }

    return 0;
  }

  getCurrentAmount(receivable: Receivable): number {
    if (receivable.paid) {
      return this.getPaidAmount(receivable);
    }

    return Number(
      receivable.currentAmountWithLateCharges ??
        this.getReceivableOpenAmount(receivable),
    );
  }

  isPartiallyPaid(receivable: Receivable): boolean {
    if (receivable.paid || receivable.canceled) {
      return false;
    }

    const amount = Number(receivable.amount ?? 0);
    const remaining = receivable.remainingBalance;
    let paidAmount = 0;

    if (receivable.paid || receivable.paymentDate) {
      paidAmount = Number(receivable.subtotal ?? 0);
    }

    if (amount <= 0) {
      return false;
    }

    if (paidAmount > 0 && paidAmount < amount) {
      return true;
    }

    if (remaining != null && remaining > 0 && remaining < amount) {
      return true;
    }

    return false;
  }

  getStatusLabel(receivable: Receivable): string {
    if (receivable.canceled) {
      return 'Cancelada';
    }

    if (this.isPartiallyPaid(receivable)) {
      return 'Pago Parcialmente';
    }

    if (receivable.paid) {
      return 'Pago';
    }

    return 'Pendente';
  }

  openFieldCustomization(): void {
    this.fieldCustomizationVisible = true;
  }

  applyVisibleFields(fields: string[]): void {
    this.visibleFields = [...fields];
    localStorage.setItem(
      'receivable-visible-fields',
      JSON.stringify(this.visibleFields),
    );
  }

  loadReceivablesForExport = (
    pagination: Pagination,
  ): Observable<PageResponse<Receivable>> => {
    return this.receivableService.list(pagination, this.filters).pipe(
      map((data) => {
        const receivables: Receivable[] = [];

        data.content.forEach((dto: ReceivableDTO) => {
          const receivable = ReceivableMapper.toModel(dto);
          receivable.status = this.getStatusLabel(receivable);
          receivable.subtotal = this.getPaidAmount(receivable);
          receivable.remainingBalance =
            this.getReceivableOpenAmount(receivable);
          receivable.currentAmountWithLateCharges =
            this.getCurrentAmount(receivable);
          receivables.push(receivable);
        });

        return {
          content: receivables,
          totalElements: data.totalElements,
        };
      }),
    );
  };

  hasAuthority(authority: string): boolean {
    return this.authService.hasAuthority(authority);
  }

  private getDefaultCharges(receivable: Receivable): {
    lateFee: number;
    lateInterest: number;
  } {
    return {
      lateFee: Number(receivable.calculatedLateFee ?? 0),
      lateInterest: Number(receivable.calculatedLateInterest ?? 0),
    };
  }

  private loadVisibleFields(): void {
    let savedFields = localStorage.getItem('receivable-visible-fields');
    let legacyFields = false;

    if (savedFields == null) {
      savedFields = localStorage.getItem('receivable-card-visible-fields');
      legacyFields = true;
    }

    if (savedFields == null) {
      return;
    }

    try {
      const fields = JSON.parse(savedFields);

      if (!Array.isArray(fields)) {
        return;
      }

      const visibleFields: string[] = [];

      if (legacyFields) {
        visibleFields.push(
          'description',
          'customerName',
          'paymentMethodName',
          'paymentFrequency',
          'status',
        );
      }

      for (let field of fields) {
        if (field === 'amount') {
          field = 'originalAmount';
        }

        if (field === 'currentAmount') {
          field = 'currentAmountWithLateCharges';
        }

        if (field === 'paidAmount') {
          field = 'subtotal';
        }

        if (field === 'balance') {
          field = 'remainingBalance';
        }

        if (field === 'createdBy') {
          field = 'createdByName';
        }

        if (field === 'updatedBy') {
          field = 'updatedByName';
        }

        if (field === 'paidBy') {
          field = 'paidByName';
        }

        for (const column of this.availableFields) {
          if (column.field === field && !visibleFields.includes(field)) {
            visibleFields.push(field);
          }
        }
      }

      if (visibleFields.length > 0) {
        this.visibleFields = visibleFields;
      }
    } catch {
      return;
    }
  }
}
