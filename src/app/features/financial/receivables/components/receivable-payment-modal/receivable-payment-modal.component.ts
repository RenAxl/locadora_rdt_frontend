import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Pagination } from 'src/app/core/models/Pagination';
import { PaymentMethodDTO } from 'src/app/features/financial/payment-methods/dtos/payment-method-dto';
import { PaymentMethodService } from 'src/app/features/financial/payment-methods/services/payment-method.service';

import { ReceivablePaymentDTO } from '../../dtos/receivable-payment-dto';
import { Receivable } from '../../models/Receivable';

@Component({
  selector: 'app-receivable-payment-modal',
  templateUrl: './receivable-payment-modal.component.html',
  styleUrls: ['./receivable-payment-modal.component.css'],
})
export class ReceivablePaymentModalComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() receivable: Receivable | null = null;
  @Input() lateFee: number = 0;
  @Input() lateInterest: number = 0;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() pay = new EventEmitter<ReceivablePaymentDTO>();

  paymentMethods: PaymentMethodDTO[] = [];
  paymentMethodId: number | null = null;
  paymentDate: string = this.todayDateString();
  paymentAmount: number | null = null;

  constructor(private paymentMethodService: PaymentMethodService) {}

  ngOnInit(): void {
    this.loadPaymentMethods();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const visibleChanged = changes['visible'] !== undefined;

    if (visibleChanged && this.visible) {
      this.paymentDate = this.todayDateString();
      if (this.receivable != null && this.receivable.paymentMethodId != null) {
        this.paymentMethodId = this.receivable.paymentMethodId;
      }
      this.paymentAmount = this.getCurrentAmount();
    }
  }

  close(): void {
    this.visibleChange.emit(false);
  }

  getOriginalAmount(): number {
    return Number(this.receivable?.originalAmount ?? this.receivable?.amount ?? 0);
  }

  getOpenAmount(): number {
    if (this.receivable?.paid) {
      return 0;
    }

    const amount = Number(this.receivable?.amount ?? 0);
    let paidAmount = 0;

    if (this.receivable != null && (this.receivable.paid || this.receivable.paymentDate)) {
      paidAmount = Number(this.receivable.subtotal ?? 0);
    }

    if (amount > 0 && paidAmount >= amount) {
      return 0;
    }

    if (amount > 0 && paidAmount > 0 && paidAmount < amount) {
      return this.roundMoney(amount - paidAmount);
    }

    const remaining = this.receivable?.remainingBalance;
    if (remaining != null && remaining > 0 && remaining < amount) {
      return Number(remaining);
    }

    return amount;
  }

  getLateFee(): number {
    if (!this.isOverdue()) {
      return 0;
    }

    return this.roundMoney(this.lateFee);
  }

  getLateInterest(): number {
    if (!this.isOverdue()) {
      return 0;
    }

    return this.roundMoney(this.lateInterest);
  }

  isOverdue(): boolean {
    if (!this.receivable?.dueDate || this.receivable.paid || this.receivable.canceled) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(this.receivable.dueDate + 'T00:00:00');

    return dueDate.getTime() < today.getTime();
  }

  getPaymentMethodFee(): number {
    for (const method of this.paymentMethods) {
      if (method.id === Number(this.paymentMethodId)) {
        const percent = Number(method.fee ?? 0);
        const fee = this.getOpenAmount() * percent / 100;

        return this.roundMoney(fee);
      }
    }

    return 0;
  }

  getCurrentAmount(): number {
    return this.roundMoney(
      this.getOpenAmount() + this.getPaymentMethodFee() + this.getLateFee() + this.getLateInterest(),
    );
  }

  getPaymentAmount(): number {
    return this.roundMoney(Number(this.paymentAmount ?? 0));
  }

  isPaymentAmountInvalid(): boolean {
    return this.isPaymentAmountEmptyOrZero() || this.isPaymentAmountGreaterThanCurrent();
  }

  isPaymentAmountEmptyOrZero(): boolean {
    const paymentAmount = this.getPaymentAmount();

    return paymentAmount <= 0;
  }

  isPaymentAmountGreaterThanCurrent(): boolean {
    return this.getPaymentAmount() > this.getCurrentAmount();
  }

  onPaymentMethodChange(): void {
    this.paymentAmount = this.getCurrentAmount();
  }

  submit(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (!this.paymentMethodId || this.isPaymentAmountInvalid()) {
      return;
    }

    const payment = new ReceivablePaymentDTO({
      paymentAmount: this.getPaymentAmount(),
      paymentDate: this.paymentDate,
      paymentMethodId: this.paymentMethodId,
      subtotal: Number(this.receivable?.amount ?? 0),
      fee: this.getPaymentMethodFee(),
      lateInterest: this.getLateInterest(),
      lateFee: this.getLateFee(),
    });

    this.pay.emit(payment);
  }

  private loadPaymentMethods(): void {
    this.paymentMethodService
      .list(new Pagination(0, 100, 'ASC', 'name'), '')
      .subscribe({
        next: (data) => {
          this.paymentMethods = data.content;
          this.paymentMethodId = this.receivable?.paymentMethodId ?? this.paymentMethods[0]?.id ?? null;
          this.paymentAmount = this.getCurrentAmount();
        },
      });
  }

  private roundMoney(value: number): number {
    return Math.round((Number(value ?? 0) + Number.EPSILON) * 100) / 100;
  }

  private todayDateString(): string {
    const today = new Date();
    const month = `${today.getMonth() + 1}`.padStart(2, '0');
    const day = `${today.getDate()}`.padStart(2, '0');

    return `${today.getFullYear()}-${month}-${day}`;
  }
}
