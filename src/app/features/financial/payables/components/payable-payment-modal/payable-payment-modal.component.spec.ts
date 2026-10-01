import { NgForm } from '@angular/forms';
import { PaymentMethodDTO } from 'src/app/features/financial/payment-methods/dtos/payment-method-dto';
import { PaymentMethodService } from 'src/app/features/financial/payment-methods/services/payment-method.service';
import { PayablePaymentDTO } from '../../dtos/payable-payment-dto';
import { Payable } from '../../models/Payable';
import { PayablePaymentModalComponent } from './payable-payment-modal.component';

describe('PayablePaymentModalComponent', () => {
  let component: PayablePaymentModalComponent;

  beforeEach(() => {
    const service = jasmine.createSpyObj<PaymentMethodService>('PaymentMethodService', ['list']);
    component = new PayablePaymentModalComponent(service);
    component.payable = new Payable();
    component.payable.amount = 100;
    component.payable.dueDate = '2020-01-01';
    component.payable.paymentDate = '2026-09-29';
    component.payable.subtotal = 40;
    component.payable.remainingBalance = 60;
    component.paymentMethods = [new PaymentMethodDTO({ id: 1, name: 'Pix' })];
    component.paymentMethodId = 1;
    component.lateFee = 2;
    component.lateInterest = 3;
  });

  it('preserves the Pix discount and the outstanding principal after a partial payment', () => {
    expect(component.getOpenAmount()).toBe(60);
    expect(component.getDiscount()).toBe(5);
    expect(component.getCurrentAmount()).toBe(60);
  });

  it('recognizes the existing boleto discount with accents in the name', () => {
    component.paymentMethods = [new PaymentMethodDTO({ id: 1, name: ' Boleto Bancário ' })];

    expect(component.getDiscount()).toBe(5);
  });

  it('ignores late fee and interest for a non-overdue payable and keeps the automatic discount', () => {
    component.payable!.dueDate = '2999-01-01';

    expect(component.getLateFee()).toBe(0);
    expect(component.getLateInterest()).toBe(0);
    expect(component.getDiscount()).toBe(5);
    expect(component.getCurrentAmount()).toBe(55);
  });

  it('does not apply late charges on the due date', () => {
    component.payable!.dueDate = component.paymentDate;

    expect(component.isOverdue()).toBeFalse();
    expect(component.getLateFee()).toBe(0);
    expect(component.getLateInterest()).toBe(0);
  });

  it('preserves the original total while calculating the payment and discount from the installment', () => {
    component.payable!.parentPayableId = 1;
    component.payable!.originalAmount = 300;

    expect(component.getOriginalAmount()).toBe(300);
    expect(component.getOpenAmount()).toBe(60);
    expect(component.getDiscount()).toBe(5);
    expect(component.getCurrentAmount()).toBe(60);
  });

  it('emits the installment principal without charging the original total', () => {
    component.payable!.parentPayableId = 1;
    component.payable!.originalAmount = 300;
    component.paymentAmount = 60;
    let payment: PayablePaymentDTO | undefined;
    component.pay.subscribe((data) => {
      payment = data;
    });

    component.submit({ invalid: false } as NgForm);

    expect(payment?.subtotal).toBe(100);
    expect(payment?.paymentAmount).toBe(60);
    expect(payment?.discount).toBe(5);
    expect(component.payable!.originalAmount).toBe(300);
  });

  it('emits a partial payment with its date and charges', () => {
    component.paymentAmount = 20;
    component.paymentDate = '2026-09-30';
    let payment: PayablePaymentDTO | undefined;
    component.pay.subscribe((data) => {
      payment = data;
    });

    component.submit({ invalid: false } as NgForm);

    expect(payment?.paymentAmount).toBe(20);
    expect(payment?.paymentDate).toBe('2026-09-30');
    expect(payment?.paymentMethodId).toBe(1);
    expect(payment?.lateFee).toBe(2);
    expect(payment?.lateInterest).toBe(3);
    expect(payment?.discount).toBe(5);
  });

  it('does not emit a payment above the current amount', () => {
    component.paymentAmount = 61;
    spyOn(component.pay, 'emit');

    component.submit({ invalid: false } as NgForm);

    expect(component.pay.emit).not.toHaveBeenCalled();
  });
});
