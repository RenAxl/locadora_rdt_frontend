import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { map, Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Pagination } from 'src/app/core/models/Pagination';
import { PageResponse } from 'src/app/core/models/page-response';
import { CustomizableField } from 'src/app/shared/models/customizable-field';
import { PayableDTO } from '../../dtos/payable-dto';
import { PayablePaymentDTO } from '../../dtos/payable-payment-dto';
import { PayableMapper } from '../../mapper/payable.mapper';
import { Payable } from '../../models/Payable';
import { PayableFilters } from '../../models/PayableFilters';
import { PayableService } from '../../services/payable.service';

@Component({
  selector: 'app-payable-list',
  templateUrl: './payable-list.component.html',
  styleUrls: ['./payable-list.component.css'],
})
export class PayableListComponent implements OnInit {
  payables: Payable[] = [];

  pagination: Pagination = new Pagination(0, 10, 'ASC', 'dueDate');

  totalElements: number = 0;

  filters: PayableFilters = new PayableFilters();

  loading: boolean = false;

  fieldCustomizationVisible: boolean = false;

  visibleFields: string[] = [
    'description',
    'supplierName',
    'originalAmount',
    'remainingBalance',
    'dueDate',
    'status',
  ];

  availableFields: CustomizableField[] = [
    { field: 'description', label: 'Descrição' },
    { field: 'supplierName', label: 'Fornecedor' },
    { field: 'employeeName', label: 'Funcionário' },
    { field: 'paymentMethodName', label: 'Forma de pagamento' },
    { field: 'paymentFrequency', label: 'Frequência' },
    { field: 'status', label: 'Situação' },
    { field: 'originalAmount', label: 'Valor original' },
    { field: 'currentAmountWithLateCharges', label: 'Valor atual' },
    { field: 'subtotal', label: 'Valor pago' },
    { field: 'dueDate', label: 'Vencimento' },
    { field: 'paymentDate', label: 'Pagamento' },
    { field: 'remainingBalance', label: 'Saldo' },
    { field: 'fee', label: 'Taxa' },
    { field: 'lateInterest', label: 'Juros' },
    { field: 'lateFee', label: 'Multa' },
    { field: 'discount', label: 'Desconto' },
    { field: 'createdByName', label: 'Criado por' },
    { field: 'createdAt', label: 'Data cadastro' },
    { field: 'updatedByName', label: 'Atualizado por' },
    { field: 'updatedAt', label: 'Data atualização' },
    { field: 'paidByName', label: 'Pago por' },
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
  payableDetails: Payable | null = null;

  overdueVisible: boolean = false;
  overduePayable: Payable | null = null;

  paymentChoiceVisible: boolean = false;
  paymentEditChargesVisible: boolean = false;
  paymentModalVisible: boolean = false;
  paymentPayable: Payable | null = null;
  paymentCharges: { lateFee: number; lateInterest: number } = {
    lateFee: 0,
    lateInterest: 0,
  };

  filesVisible: boolean = false;
  selectedPayableId?: number;
  selectedPayableDescription?: string;

  constructor(
    private payableService: PayableService,
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

    this.payableService.list(this.pagination, this.filters).subscribe({
      next: (data) => {
        this.payables = [];

        data.content.forEach((dto: PayableDTO) => {
          const payable = PayableMapper.toModel(dto);
          payable.status = this.getStatusLabel(payable);
          this.payables.push(payable);
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

  applyFilters(filters: PayableFilters): void {
    this.filters = filters;
    this.pagination.orderBy = filters.orderBy || this.pagination.orderBy;
    this.pagination.direction = filters.direction || this.pagination.direction;
    this.list(0);
  }

  clearFilters(): void {
    this.filters = new PayableFilters();
    this.pagination.orderBy = 'dueDate';
    this.pagination.direction = 'ASC';
    this.list(0);
  }

  delete(payable: Payable): void {
    if (!payable.id) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.payableService.delete(payable.id!).subscribe(() => {
          this.list(0);
          this.messageService.add({
            severity: 'success',
            detail: 'Conta excluída com sucesso!',
          });
        });
      },
    });
  }

  pay(payable: Payable): void {
    const amount = this.getPayableOpenAmount(payable);
    if (!payable.id) {
      return;
    }

    if (amount <= 0) {
      this.messageService.add({
        severity: 'warn',
        detail: 'Esta conta não possui saldo para baixa.',
      });
      return;
    }

    this.paymentPayable = payable;
    this.paymentCharges = this.getDefaultCharges(payable);

    if (this.isOverdueOpenPayable(payable)) {
      this.paymentChoiceVisible = true;
      return;
    }

    this.paymentModalVisible = true;
  }

  getPayableOpenAmount(payable: Payable): number {
    if (payable.paid) {
      return 0;
    }

    const amount = Number(payable.amount ?? 0);
    let paidAmount = 0;

    if (payable.paid || payable.paymentDate) {
      paidAmount = Number(payable.subtotal ?? 0);
    }

    if (amount > 0 && paidAmount >= amount) {
      return 0;
    }

    if (amount > 0 && paidAmount > 0 && paidAmount < amount) {
      return Math.round((amount - paidAmount) * 100) / 100;
    }

    const remaining = payable.remainingBalance;

    if (remaining != null && remaining > 0 && remaining < amount) {
      return Number(remaining);
    }

    return amount;
  }

  useDefaultPaymentCharges(): void {
    if (!this.paymentPayable) {
      return;
    }

    this.paymentCharges = this.getDefaultCharges(this.paymentPayable);
    this.paymentChoiceVisible = false;
    this.paymentModalVisible = true;
  }

  editPaymentCharges(): void {
    if (!this.paymentPayable || !this.isOverdueOpenPayable(this.paymentPayable)) {
      return;
    }

    this.paymentChoiceVisible = false;
    this.paymentEditChargesVisible = true;
  }

  finishPaymentChargesEdit(charges: {
    lateFee: number;
    lateInterest: number;
  }): void {
    if (!this.paymentPayable || !this.isOverdueOpenPayable(this.paymentPayable)) {
      return;
    }

    this.paymentCharges = charges;
    this.paymentEditChargesVisible = false;
    this.paymentModalVisible = true;
  }

  submitPayment(dto: PayablePaymentDTO): void {
    if (this.paymentPayable == null || this.paymentPayable.id == null) {
      return;
    }

    this.payableService.pay(this.paymentPayable.id, dto).subscribe({
      next: () => {
        this.paymentModalVisible = false;
        this.paymentPayable = null;
        this.list(this.pagination.page);
        this.messageService.add({
          severity: 'success',
          detail: 'Baixa registrada!',
        });
      },
    });
  }

  isOverdueOpenPayable(payable: Payable): boolean {
    if (payable.paid || payable.canceled || !payable.dueDate) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueDate = new Date(payable.dueDate + 'T00:00:00');
    dueDate.setHours(0, 0, 0, 0);

    return (
      dueDate.getTime() < today.getTime() &&
      this.getPayableOpenAmount(payable) > 0
    );
  }

  openDetails(payable: Payable): void {
    if (!payable.id) {
      return;
    }

    this.detailsVisible = true;
    this.payableDetails = null;

    this.payableService.findById(payable.id).subscribe({
      next: (details) => {
        this.payableDetails = PayableMapper.toModel(details);
      },
    });
  }

  openOverdueDetails(payable: Payable): void {
    this.overduePayable = payable;
    this.overdueVisible = true;
  }

  openFilesModal(payable: Payable): void {
    this.selectedPayableId = payable.id;
    this.selectedPayableDescription = payable.description;
    this.filesVisible = true;
  }

  getPaidAmount(payable: Payable): number {
    const amount = Number(payable.amount ?? 0);

    if (payable.paid) {
      return amount;
    }

    if (
      (payable.paid || payable.paymentDate) &&
      payable.subtotal != null &&
      payable.subtotal > 0
    ) {
      if (amount > 0) {
        return Math.min(Number(payable.subtotal), amount);
      }

      return Number(payable.subtotal);
    }

    if (this.isPartiallyPaid(payable)) {
      return amount - this.getPayableOpenAmount(payable);
    }

    return 0;
  }

  getCurrentAmount(payable: Payable): number {
    if (payable.paid) {
      return Number(payable.amount ?? 0);
    }

    return Number(payable.currentAmountWithLateCharges ?? this.getPayableOpenAmount(payable));
  }

  isPartiallyPaid(payable: Payable): boolean {
    if (payable.paid || payable.canceled) {
      return false;
    }

    const amount = Number(payable.amount ?? 0);
    const remaining = payable.remainingBalance;
    let paidAmount = 0;

    if (payable.paid || payable.paymentDate) {
      paidAmount = Number(payable.subtotal ?? 0);
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

  getStatusLabel(payable: Payable): string {
    if (payable.canceled) {
      return 'Cancelada';
    }

    if (this.isPartiallyPaid(payable)) {
      return 'Pago Parcialmente';
    }

    if (payable.paid) {
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
      'payable-visible-fields',
      JSON.stringify(this.visibleFields),
    );
  }

  loadPayablesForExport = (
    pagination: Pagination,
  ): Observable<PageResponse<Payable>> => {
    return this.payableService.list(pagination, this.filters).pipe(
      map((data) => {
        const payables: Payable[] = [];

        data.content.forEach((dto: PayableDTO) => {
          const payable = PayableMapper.toModel(dto);
          payable.status = this.getStatusLabel(payable);
          payable.subtotal = this.getPaidAmount(payable);
          payable.remainingBalance = this.getPayableOpenAmount(payable);
          payable.currentAmountWithLateCharges = this.getCurrentAmount(payable);
          payables.push(payable);
        });

        return {
          content: payables,
          totalElements: data.totalElements,
        };
      }),
    );
  };

  hasAuthority(authority: string): boolean {
    return this.authService.hasAuthority(authority);
  }

  private getDefaultCharges(payable: Payable): {
    lateFee: number;
    lateInterest: number;
  } {
    return {
      lateFee: Number(payable.calculatedLateFee ?? 0),
      lateInterest: Number(payable.calculatedLateInterest ?? 0),
    };
  }

  private loadVisibleFields(): void {
    let savedFields = localStorage.getItem('payable-visible-fields');
    let legacyFields = false;

    if (savedFields == null) {
      savedFields = localStorage.getItem('payable-card-visible-fields');
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
          'supplierName',
          'employeeName',
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
