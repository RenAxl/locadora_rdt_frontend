import { NgForm } from '@angular/forms';
import { PaymentMethodDTO } from 'src/app/features/financial/payment-methods/dtos/payment-method-dto';
import { PaymentMethodService } from 'src/app/features/financial/payment-methods/services/payment-method.service';
import { ReceivablePaymentDTO } from '../../dtos/receivable-payment-dto';
import { Receivable } from '../../models/Receivable';
import { ReceivablePaymentModalComponent } from './receivable-payment-modal.component';

describe('ReceivablePaymentModalComponent', () => {
  let component: ReceivablePaymentModalComponent;

  beforeEach(() => {
    const service = jasmine.createSpyObj<PaymentMethodService>('PaymentMethodService', ['list']);
    component = new ReceivablePaymentModalComponent(service);
    component.receivable = new Receivable();
    component.receivable.amount = 100;
    component.receivable.dueDate = '2020-01-01';
    component.receivable.paymentDate = '2026-09-29';
    component.receivable.subtotal = 40;
    component.receivable.remainingBalance = 60;
    component.paymentMethods = [new PaymentMethodDTO({ id: 1, name: 'Pix' })];
    component.paymentMethodId = 1;
    component.lateFee = 2;
    component.lateInterest = 3;
  });

  it('keeps the full outstanding balance and charges for Pix after a partial payment', () => {
    expect(component.getOpenAmount()).toBe(60);
    expect(component.getCurrentAmount()).toBe(65);
  });

  it('keeps the same current amount when changing from Pix to boleto', () => {
    component.paymentMethods = [new PaymentMethodDTO({ id: 1, name: ' Boleto Bancário ' })];
    component.onPaymentMethodChange();

    expect(component.getCurrentAmount()).toBe(65);
    expect(component.paymentAmount).toBe(65);
  });

  it('ignores late fee and interest for a non-overdue receivable without applying a discount', () => {
    component.receivable!.dueDate = '2999-01-01';

    expect(component.getLateFee()).toBe(0);
    expect(component.getLateInterest()).toBe(0);
    expect(component.getCurrentAmount()).toBe(60);
  });

  it('does not apply late charges on the due date', () => {
    component.receivable!.dueDate = component.paymentDate;

    expect(component.isOverdue()).toBeFalse();
    expect(component.getLateFee()).toBe(0);
    expect(component.getLateInterest()).toBe(0);
  });

  it('preserves the original total while calculating the account payment', () => {
    component.receivable!.parentReceivableId = 1;
    component.receivable!.originalAmount = 300;

    expect(component.getOriginalAmount()).toBe(300);
    expect(component.getOpenAmount()).toBe(60);
    expect(component.getCurrentAmount()).toBe(65);
  });

  it('emits the account principal without charging the original total', () => {
    component.receivable!.parentReceivableId = 1;
    component.receivable!.originalAmount = 300;
    component.paymentAmount = 65;
    let payment: ReceivablePaymentDTO | undefined;
    component.pay.subscribe((data) => {
      payment = data;
    });

    component.submit({ invalid: false } as NgForm);

    expect(payment?.subtotal).toBe(100);
    expect(payment?.paymentAmount).toBe(65);
    expect('discount' in payment!).toBeFalse();
    expect(component.receivable!.originalAmount).toBe(300);
  });

  it('emits a partial payment with its date and charges', () => {
    component.paymentAmount = 20;
    component.paymentDate = '2026-09-30';
    let payment: ReceivablePaymentDTO | undefined;
    component.pay.subscribe((data) => {
      payment = data;
    });

    component.submit({ invalid: false } as NgForm);

    expect(payment?.paymentAmount).toBe(20);
    expect(payment?.paymentDate).toBe('2026-09-30');
    expect(payment?.paymentMethodId).toBe(1);
    expect(payment?.lateFee).toBe(2);
    expect(payment?.lateInterest).toBe(3);
    expect('discount' in payment!).toBeFalse();
  });

  it('does not emit a payment above the current amount', () => {
    component.paymentAmount = 66;
    spyOn(component.pay, 'emit');

    component.submit({ invalid: false } as NgForm);

    expect(component.pay.emit).not.toHaveBeenCalled();
  });
  it('emits the full balance for Pix and boleto without a discount', () => {
    component.receivable!.dueDate = '2999-01-01';
    component.receivable!.paymentDate = null;
    component.receivable!.subtotal = 0;
    component.receivable!.remainingBalance = 100;
    const emit = spyOn(component.pay, 'emit');

    for (const name of ['Pix', 'Boleto Bancário']) {
      component.paymentMethods = [new PaymentMethodDTO({ id: 1, name })];
      component.onPaymentMethodChange();
      component.submit({ invalid: false } as NgForm);
      const payment = emit.calls.mostRecent().args[0]!;

      expect(component.paymentAmount).toBe(100);
      expect(payment.paymentAmount).toBe(100);
      expect('discount' in payment).toBeFalse();
    }
  });

  it('includes the method fee on the outstanding balance with late charges', () => {
    component.paymentMethods[0].fee = 5;
    component.onPaymentMethodChange();

    expect(component.getPaymentMethodFee()).toBe(3);
    expect(component.getCurrentAmount()).toBe(68);
    expect(component.paymentAmount).toBe(68);
    const emit = spyOn(component.pay, 'emit');

    component.submit({ invalid: false } as NgForm);

    expect(emit.calls.mostRecent().args[0]?.fee).toBe(3);
    expect(emit.calls.mostRecent().args[0]?.paymentAmount).toBe(68);
  });

  it('applies the method fee before the due date and recalculates when the method changes', () => {
    component.receivable!.dueDate = '2999-01-01';
    component.paymentMethods = [
      new PaymentMethodDTO({ id: 1, name: 'Cartão', fee: 5 }),
      new PaymentMethodDTO({ id: 2, name: 'Dinheiro', fee: null }),
    ];
    component.onPaymentMethodChange();

    expect(component.getPaymentMethodFee()).toBe(3);
    expect(component.paymentAmount).toBe(63);

    component.paymentMethodId = 2;
    component.onPaymentMethodChange();

    expect(component.getPaymentMethodFee()).toBe(0);
    expect(component.paymentAmount).toBe(60);
  });

  it('rounds the method fee to cents without using the parent account total', () => {
    component.receivable!.originalAmount = 300;
    component.receivable!.amount = 20.1;
    component.receivable!.subtotal = 0;
    component.receivable!.remainingBalance = 20.1;
    component.receivable!.paymentDate = null;
    component.receivable!.dueDate = '2999-01-01';
    component.paymentMethods[0].fee = 5;
    component.onPaymentMethodChange();

    expect(component.getPaymentMethodFee()).toBe(1.01);
    expect(component.paymentAmount).toBe(21.11);
  });

  it('does not apply a fee when no payment method is selected', () => {
    component.paymentMethods[0].fee = 5;
    component.paymentMethodId = null;

    expect(component.getPaymentMethodFee()).toBe(0);
    expect(component.getCurrentAmount()).toBe(65);
  });

});
