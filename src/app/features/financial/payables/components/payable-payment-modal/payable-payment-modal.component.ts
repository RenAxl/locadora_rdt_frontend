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

import { PayablePaymentDTO } from '../../dtos/payable-payment-dto';
import { Payable } from '../../models/Payable';

@Component({
  selector: 'app-payable-payment-modal',
  templateUrl: './payable-payment-modal.component.html',
  styleUrls: ['./payable-payment-modal.component.css'],
})
export class PayablePaymentModalComponent implements OnInit, OnChanges {
  @Input() visible = false;
  @Input() payable: Payable | null = null;
  @Input() lateFee: number = 0;
  @Input() lateInterest: number = 0;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() pay = new EventEmitter<PayablePaymentDTO>();

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
      if (this.payable != null && this.payable.paymentMethodId != null) {
        this.paymentMethodId = this.payable.paymentMethodId;
      }
      this.paymentAmount = this.getCurrentAmount();
    }
  }

  close(): void {
    this.visibleChange.emit(false);
  }

  getOriginalAmount(): number {
    return Number(this.payable?.originalAmount ?? this.payable?.amount ?? 0);
  }

  getOpenAmount(): number {
    if (this.payable?.paid) {
      return 0;
    }

    const amount = Number(this.payable?.amount ?? 0);
    let paidAmount = 0;

    if (this.payable != null && (this.payable.paid || this.payable.paymentDate)) {
      paidAmount = Number(this.payable.subtotal ?? 0);
    }

    if (amount > 0 && paidAmount >= amount) {
      return 0;
    }

    if (amount > 0 && paidAmount > 0 && paidAmount < amount) {
      return this.roundMoney(amount - paidAmount);
    }

    const remaining = this.payable?.remainingBalance;
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
    if (!this.payable?.dueDate || this.payable.paid || this.payable.canceled) {
      return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(this.payable.dueDate + 'T00:00:00');

    return dueDate.getTime() < today.getTime();
  }

  getDiscount(): number {
    if (!this.hasDiscountPaymentMethod()) {
      return 0;
    }

    return this.roundMoney(Number(this.payable?.amount ?? 0) * 0.05);
  }

  getCurrentAmount(): number {
    return this.roundMoney(
      this.getOpenAmount() + this.getLateFee() + this.getLateInterest() - this.getDiscount(),
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

    const payment = new PayablePaymentDTO({
      paymentAmount: this.getPaymentAmount(),
      paymentDate: this.paymentDate,
      paymentMethodId: this.paymentMethodId,
      subtotal: Number(this.payable?.amount ?? 0),
      fee: 0,
      lateInterest: this.getLateInterest(),
      lateFee: this.getLateFee(),
      discount: this.getDiscount(),
    });

    this.pay.emit(payment);
  }

  private loadPaymentMethods(): void {
    this.paymentMethodService
      .list(new Pagination(0, 100, 'ASC', 'name'), '')
      .subscribe({
        next: (data) => {
          this.paymentMethods = data.content;
          this.paymentMethodId = this.payable?.paymentMethodId ?? this.paymentMethods[0]?.id ?? null;
          this.paymentAmount = this.getCurrentAmount();
        },
      });
  }

  private hasDiscountPaymentMethod(): boolean {
    for (const method of this.paymentMethods) {
      if (method.id === Number(this.paymentMethodId)) {
        let name = method.name || '';
        name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        name = name.trim().toLowerCase();

        if (name === 'pix' || name === 'boleto bancario') {
          return true;
        }

        return false;
      }
    }

    return false;
  }

  private roundMoney(value: number): number {
    return Math.round(Number(value ?? 0) * 100) / 100;
  }

  private todayDateString(): string {
    const today = new Date();
    const month = `${today.getMonth() + 1}`.padStart(2, '0');
    const day = `${today.getDate()}`.padStart(2, '0');

    return `${today.getFullYear()}-${month}-${day}`;
  }
}
