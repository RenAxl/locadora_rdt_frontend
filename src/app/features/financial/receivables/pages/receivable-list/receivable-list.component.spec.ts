import { ConfirmationService, MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Pagination } from 'src/app/core/models/Pagination';
import { ReceivableDTO } from '../../dtos/receivable-dto';
import { Receivable } from '../../models/Receivable';
import { ReceivableService } from '../../services/receivable.service';
import { ReceivableListComponent } from './receivable-list.component';

describe('ReceivableListComponent', () => {
  let component: ReceivableListComponent;
  let service: jasmine.SpyObj<ReceivableService>;
  let receivable: Receivable;

  beforeEach(() => {
    service = jasmine.createSpyObj<ReceivableService>('ReceivableService', ['list']);
    const authService = jasmine.createSpyObj<AuthService>('AuthService', ['hasAuthority']);
    component = new ReceivableListComponent(
      service,
      new MessageService(),
      new ConfirmationService(),
      authService,
    );
    receivable = new Receivable();
    receivable.amount = 100;
    receivable.originalAmount = 100;
    receivable.paid = true;
    receivable.subtotal = 108;
    receivable.currentAmountWithLateCharges = 108;
    receivable.remainingBalance = 0;
  });

  it('shows the settled amount including charges instead of the original principal', () => {
    expect(component.getPaidAmount(receivable)).toBe(108);
    expect(component.getCurrentAmount(receivable)).toBe(108);
    expect(component.getReceivableOpenAmount(receivable)).toBe(0);
    expect(receivable.originalAmount).toBe(100);
  });

  it('keeps the discounted amount after settlement', () => {
    receivable.subtotal = 95;
    receivable.currentAmountWithLateCharges = 95;

    expect(component.getPaidAmount(receivable)).toBe(95);
    expect(component.getCurrentAmount(receivable)).toBe(95);
  });

  it('uses the paid subtotal when the current amount is missing', () => {
    receivable.subtotal = 95;
    receivable.currentAmountWithLateCharges = null;

    expect(component.getPaidAmount(receivable)).toBe(95);
    expect(component.getCurrentAmount(receivable)).toBe(95);
  });

  it('preserves the outstanding balance and the amount already paid on partial payments', () => {
    receivable.paid = false;
    receivable.paymentDate = '2026-09-30';
    receivable.subtotal = 40;
    receivable.remainingBalance = 60;
    receivable.currentAmountWithLateCharges = 62.4;

    expect(component.getPaidAmount(receivable)).toBe(40);
    expect(component.getCurrentAmount(receivable)).toBe(62.4);
    expect(component.getReceivableOpenAmount(receivable)).toBe(60);
  });

  it('exports the same current and paid amounts shown on the settled account', () => {
    service.list.and.returnValue(of({
      content: [new ReceivableDTO(receivable)],
      totalElements: 1,
    }));

    component.loadReceivablesForExport(new Pagination(0, 10, 'ASC', 'dueDate')).subscribe((data) => {
      expect(data.content[0].amount).toBe(100);
      expect(data.content[0].subtotal).toBe(108);
      expect(data.content[0].currentAmountWithLateCharges).toBe(108);
      expect(data.content[0].remainingBalance).toBe(0);
    });
  });
});
