import { ConfirmationService, MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Pagination } from 'src/app/core/models/Pagination';
import { PayableDTO } from '../../dtos/payable-dto';
import { Payable } from '../../models/Payable';
import { PayableService } from '../../services/payable.service';
import { PayableListComponent } from './payable-list.component';

describe('PayableListComponent', () => {
  let component: PayableListComponent;
  let service: jasmine.SpyObj<PayableService>;
  let payable: Payable;

  beforeEach(() => {
    service = jasmine.createSpyObj<PayableService>('PayableService', ['list']);
    const authService = jasmine.createSpyObj<AuthService>('AuthService', ['hasAuthority']);
    component = new PayableListComponent(
      service,
      new MessageService(),
      new ConfirmationService(),
      authService,
    );
    payable = new Payable();
    payable.amount = 100;
    payable.originalAmount = 100;
    payable.paid = true;
    payable.subtotal = 108;
    payable.currentAmountWithLateCharges = 108;
    payable.remainingBalance = 0;
  });

  it('shows the settled amount including charges instead of the original principal', () => {
    expect(component.getPaidAmount(payable)).toBe(108);
    expect(component.getCurrentAmount(payable)).toBe(108);
    expect(component.getPayableOpenAmount(payable)).toBe(0);
    expect(payable.originalAmount).toBe(100);
  });

  it('keeps the discounted amount after settlement', () => {
    payable.subtotal = 95;
    payable.currentAmountWithLateCharges = 95;

    expect(component.getPaidAmount(payable)).toBe(95);
    expect(component.getCurrentAmount(payable)).toBe(95);
  });

  it('uses the paid subtotal when the current amount is missing', () => {
    payable.subtotal = 95;
    payable.currentAmountWithLateCharges = null;

    expect(component.getPaidAmount(payable)).toBe(95);
    expect(component.getCurrentAmount(payable)).toBe(95);
  });

  it('preserves the outstanding balance and the amount already paid on partial payments', () => {
    payable.paid = false;
    payable.paymentDate = '2026-09-30';
    payable.subtotal = 40;
    payable.remainingBalance = 60;
    payable.currentAmountWithLateCharges = 62.4;

    expect(component.getPaidAmount(payable)).toBe(40);
    expect(component.getCurrentAmount(payable)).toBe(62.4);
    expect(component.getPayableOpenAmount(payable)).toBe(60);
  });

  it('exports the same current and paid amounts shown on the settled account', () => {
    service.list.and.returnValue(of({
      content: [new PayableDTO(payable)],
      totalElements: 1,
    }));

    component.loadPayablesForExport(new Pagination(0, 10, 'ASC', 'dueDate')).subscribe((data) => {
      expect(data.content[0].amount).toBe(100);
      expect(data.content[0].subtotal).toBe(108);
      expect(data.content[0].currentAmountWithLateCharges).toBe(108);
      expect(data.content[0].remainingBalance).toBe(0);
    });
  });
});
