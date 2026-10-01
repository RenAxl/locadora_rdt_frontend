import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EmployeeDTO } from 'src/app/features/organization/employees/dtos/employee-dto';
import { SupplierDTO } from 'src/app/features/organization/suppliers/dtos/supplier-dto';
import { PayableFilters } from '../../models/PayableFilters';

import { PayableFiltersComponent } from './payable-filters.component';
import { PayableQuickPeriodFilterComponent } from '../payable-quick-period-filter/payable-quick-period-filter.component';

describe('PayableFiltersComponent', () => {
  let component: PayableFiltersComponent;
  let fixture: ComponentFixture<PayableFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        PayableFiltersComponent,
        PayableQuickPeriodFilterComponent,
      ],
      imports: [CommonModule, HttpClientTestingModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PayableFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('emits the selected entities, zero minimum amount and ordering', () => {
    component.suppliers = [new SupplierDTO({ id: 5, name: 'Fornecedor RDT' })];
    component.employees = [new EmployeeDTO({ id: 8, name: 'Ana' })];
    component.supplierSearch = ' fornecedor rdt ';
    component.employeeSearch = ' ANA ';
    component.filters.minimumAmount = 0;
    component.selectedSort = 2;
    let filters: PayableFilters | undefined;
    component.filter.subscribe((data) => {
      filters = data;
    });

    component.applyFilters();

    expect(filters?.supplierId).toBe(5);
    expect(filters?.employeeId).toBe(8);
    expect(filters?.minimumAmount).toBe(0);
    expect(filters?.orderBy).toBe('amount');
    expect(filters?.direction).toBe('DESC');
  });

  it('applies a quick period immediately using the other filters', () => {
    component.filters.status = 'OVERDUE';
    const emit = spyOn(component.filter, 'emit');

    component.onQuickPeriodChange({ startDate: '2026-09-01', endDate: '2026-09-30' });

    const filters = emit.calls.mostRecent().args[0];
    expect(filters?.status).toBe('OVERDUE');
    expect(filters?.startDate).toBe('2026-09-01');
    expect(filters?.endDate).toBe('2026-09-30');
  });
});
