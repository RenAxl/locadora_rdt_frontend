import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { PaymentMethod } from 'src/app/features/financial/payment-methods/models/PaymentMethod';
import { Rental } from '../../models/Rental';

@Component({
  selector: 'app-rental-checkout-modal',
  templateUrl: './rental-checkout-modal.component.html',
  styleUrls: ['./rental-checkout-modal.component.css'],
})
export class RentalCheckoutModalComponent implements OnChanges {
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Input() rental: Rental | null = null;
  @Input() paymentMethods: PaymentMethod[] = [];
  @Input() paymentMethodId?: number;
  @Input() saving = false;

  @Output() paymentMethodIdChange = new EventEmitter<number | undefined>();
  @Output() confirm = new EventEmitter<void>();

  today: Date = new Date();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['visible'] !== undefined && this.visible) {
      this.today = new Date();
    }
  }

  get rentalValue(): number {
    if (this.rental == null) {
      return 0;
    }

    return this.rental.totalAmount;
  }

  get lateFee(): number {
    if (this.rental == null) {
      return 0;
    }

    return this.rental.calculatedLateFee;
  }

  get discount(): number {
    if (this.lateFee > 0 || !this.hasDiscountPaymentMethod()) {
      return 0;
    }

    return Math.round(this.rentalValue * 0.05 * 100) / 100;
  }

  get total(): number {
    return this.rentalValue + this.lateFee - this.discount;
  }

  get hasLateFeeDiscountWarning(): boolean {
    return this.lateFee > 0 && this.hasDiscountPaymentMethod();
  }

  changePaymentMethod(): void {
    this.paymentMethodIdChange.emit(this.paymentMethodId);
  }

  save(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    if (this.rental == null || this.saving) {
      return;
    }

    this.confirm.emit();
  }

  close(): void {
    if (this.saving) {
      return;
    }

    this.visibleChange.emit(false);
  }

  private hasDiscountPaymentMethod(): boolean {
    for (const paymentMethod of this.paymentMethods) {
      if (paymentMethod.id === this.paymentMethodId) {
        const name = paymentMethod.name.toLowerCase();

        if (name === 'pix' || name.includes('boleto banc')) {
          return true;
        }
      }
    }

    return false;
  }
}
