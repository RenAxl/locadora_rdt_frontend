import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Pagination } from 'src/app/core/models/Pagination';
import { EmployeeDTO } from 'src/app/features/organization/employees/dtos/employee-dto';
import { EmployeeService } from 'src/app/features/organization/employees/services/employee.service';
import { PaymentFrequencyDTO } from 'src/app/features/financial/payment-frequencies/dtos/payment-frequency-dto';
import { PaymentFrequencyService } from 'src/app/features/financial/payment-frequencies/services/payment-frequency.service';
import { PaymentMethodDTO } from 'src/app/features/financial/payment-methods/dtos/payment-method-dto';
import { PaymentMethodService } from 'src/app/features/financial/payment-methods/services/payment-method.service';
import { SupplierDTO } from 'src/app/features/organization/suppliers/dtos/supplier-dto';
import { SupplierService } from 'src/app/features/organization/suppliers/services/supplier.service';

import { PayableQuickPeriodRange } from '../payable-quick-period-filter/payable-quick-period-filter.component';
import { PayableFilters } from '../../models/PayableFilters';

interface PayableSortOption {
  label: string;
  orderBy: string;
  direction: string;
}

@Component({
  selector: 'app-payable-filters',
  templateUrl: './payable-filters.component.html',
  styleUrls: ['./payable-filters.component.css'],
})
export class PayableFiltersComponent implements OnInit {
  @Output() filter = new EventEmitter<PayableFilters>();
  @Output() clear = new EventEmitter<void>();

  filters: PayableFilters = new PayableFilters();
  supplierSearch: string = '';
  employeeSearch: string = '';
  selectedSort: number = 0;
  suppliers: SupplierDTO[] = [];
  employees: EmployeeDTO[] = [];
  paymentMethods: PaymentMethodDTO[] = [];
  paymentFrequencies: PaymentFrequencyDTO[] = [];

  sortOptions: PayableSortOption[] = [
    { label: 'Vencimento (mais próximo)', orderBy: 'dueDate', direction: 'ASC' },
    { label: 'Vencimento (mais distante)', orderBy: 'dueDate', direction: 'DESC' },
    { label: 'Maior valor', orderBy: 'amount', direction: 'DESC' },
    { label: 'Menor valor', orderBy: 'amount', direction: 'ASC' },
    { label: 'Mais recente', orderBy: 'createdDate', direction: 'DESC' },
    { label: 'Mais antiga', orderBy: 'createdDate', direction: 'ASC' },
  ];

  constructor(
    private supplierService: SupplierService,
    private employeeService: EmployeeService,
    private paymentMethodService: PaymentMethodService,
    private paymentFrequencyService: PaymentFrequencyService,
  ) {}

  ngOnInit(): void {
    this.loadOptions();
  }

  applyFilters(): void {
    this.syncSupplierId();
    this.syncEmployeeId();

    const sort = this.sortOptions[this.selectedSort];
    this.filters.search = this.filters.search.trim();
    this.filters.orderBy = sort.orderBy;
    this.filters.direction = sort.direction;

    const filters = new PayableFilters();
    filters.search = this.filters.search;
    filters.periodType = this.filters.periodType;
    filters.startDate = this.filters.startDate;
    filters.endDate = this.filters.endDate;
    filters.status = this.filters.status;
    filters.supplierId = this.filters.supplierId;
    filters.employeeId = this.filters.employeeId;
    filters.paymentMethodId = this.filters.paymentMethodId;
    filters.paymentFrequencyId = this.filters.paymentFrequencyId;
    filters.minimumAmount = this.filters.minimumAmount;
    filters.maximumAmount = this.filters.maximumAmount;
    filters.orderBy = this.filters.orderBy;
    filters.direction = this.filters.direction;

    this.filter.emit(filters);
  }

  clearFilters(): void {
    this.filters = new PayableFilters();
    this.supplierSearch = '';
    this.employeeSearch = '';
    this.selectedSort = 0;
    this.clear.emit();
  }

  onSupplierInput(): void {
    this.filters.supplierId = null;
  }

  onEmployeeInput(): void {
    this.filters.employeeId = null;
  }

  onQuickPeriodChange(period: PayableQuickPeriodRange): void {
    this.filters.startDate = period.startDate;
    this.filters.endDate = period.endDate;
    this.applyFilters();
  }

  private loadOptions(): void {
    this.supplierService
      .list(new Pagination(0, 1000, 'ASC', 'name'), '')
      .subscribe((response) => {
        this.suppliers = response.content;
      });

    this.employeeService
      .list(new Pagination(0, 1000, 'ASC', 'name'), '')
      .subscribe((response) => {
        this.employees = response.content;
      });

    this.paymentMethodService
      .list(new Pagination(0, 1000, 'ASC', 'name'), '')
      .subscribe((response) => {
        this.paymentMethods = response.content;
      });

    this.paymentFrequencyService
      .list(new Pagination(0, 1000, 'ASC', 'frequency'), '')
      .subscribe((response) => {
        this.paymentFrequencies = response.content;
      });
  }

  private syncSupplierId(): void {
    const search = this.supplierSearch.trim().toLowerCase();
    this.filters.supplierId = null;

    if (search === '') {
      return;
    }

    for (const supplier of this.suppliers) {
      if (supplier.name != null && supplier.name.toLowerCase() === search) {
        this.filters.supplierId = supplier.id ?? null;
        return;
      }
    }
  }

  private syncEmployeeId(): void {
    const search = this.employeeSearch.trim().toLowerCase();
    this.filters.employeeId = null;

    if (search === '') {
      return;
    }

    for (const employee of this.employees) {
      if (employee.name != null && employee.name.toLowerCase() === search) {
        this.filters.employeeId = employee.id ?? null;
        return;
      }
    }
  }
}
