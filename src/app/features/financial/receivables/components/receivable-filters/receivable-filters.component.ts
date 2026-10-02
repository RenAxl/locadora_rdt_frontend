import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Pagination } from 'src/app/core/models/Pagination';
import { PaymentFrequencyDTO } from 'src/app/features/financial/payment-frequencies/dtos/payment-frequency-dto';
import { PaymentFrequencyService } from 'src/app/features/financial/payment-frequencies/services/payment-frequency.service';
import { PaymentMethodDTO } from 'src/app/features/financial/payment-methods/dtos/payment-method-dto';
import { PaymentMethodService } from 'src/app/features/financial/payment-methods/services/payment-method.service';
import { CustomerDTO } from 'src/app/features/organization/customers/dtos/customer-dto';
import { CustomerService } from 'src/app/features/organization/customers/services/customer.service';

import { ReceivableQuickPeriodRange } from '../receivable-quick-period-filter/receivable-quick-period-filter.component';
import { ReceivableFilters } from '../../models/ReceivableFilters';

interface ReceivableSortOption {
  label: string;
  orderBy: string;
  direction: string;
}

@Component({
  selector: 'app-receivable-filters',
  templateUrl: './receivable-filters.component.html',
  styleUrls: ['./receivable-filters.component.css'],
})
export class ReceivableFiltersComponent implements OnInit {
  @Output() filter = new EventEmitter<ReceivableFilters>();
  @Output() clear = new EventEmitter<void>();

  filters: ReceivableFilters = new ReceivableFilters();
  customerSearch: string = '';
  selectedSort: number = 0;
  customers: CustomerDTO[] = [];
  paymentMethods: PaymentMethodDTO[] = [];
  paymentFrequencies: PaymentFrequencyDTO[] = [];

  sortOptions: ReceivableSortOption[] = [
    { label: 'Vencimento (mais próximo)', orderBy: 'dueDate', direction: 'ASC' },
    { label: 'Vencimento (mais distante)', orderBy: 'dueDate', direction: 'DESC' },
    { label: 'Maior valor', orderBy: 'amount', direction: 'DESC' },
    { label: 'Menor valor', orderBy: 'amount', direction: 'ASC' },
    { label: 'Mais recente', orderBy: 'createdDate', direction: 'DESC' },
    { label: 'Mais antiga', orderBy: 'createdDate', direction: 'ASC' },
  ];

  constructor(
    private customerService: CustomerService,
    private paymentMethodService: PaymentMethodService,
    private paymentFrequencyService: PaymentFrequencyService,
  ) {}

  ngOnInit(): void {
    this.loadOptions();
  }

  applyFilters(): void {
    this.syncCustomerId();

    const sort = this.sortOptions[this.selectedSort];
    this.filters.search = this.filters.search.trim();
    this.filters.orderBy = sort.orderBy;
    this.filters.direction = sort.direction;

    const filters = new ReceivableFilters();
    filters.search = this.filters.search;
    filters.periodType = this.filters.periodType;
    filters.startDate = this.filters.startDate;
    filters.endDate = this.filters.endDate;
    filters.status = this.filters.status;
    filters.customerId = this.filters.customerId;
    filters.paymentMethodId = this.filters.paymentMethodId;
    filters.paymentFrequencyId = this.filters.paymentFrequencyId;
    filters.minimumAmount = this.filters.minimumAmount;
    filters.maximumAmount = this.filters.maximumAmount;
    filters.orderBy = this.filters.orderBy;
    filters.direction = this.filters.direction;

    this.filter.emit(filters);
  }

  clearFilters(): void {
    this.filters = new ReceivableFilters();
    this.customerSearch = '';
    this.selectedSort = 0;
    this.clear.emit();
  }

  onCustomerInput(): void {
    this.filters.customerId = null;
  }

  onQuickPeriodChange(period: ReceivableQuickPeriodRange): void {
    this.filters.startDate = period.startDate;
    this.filters.endDate = period.endDate;
    this.applyFilters();
  }

  private loadOptions(): void {
    this.customerService
      .list(new Pagination(0, 1000, 'ASC', 'name'), '')
      .subscribe((response) => {
        this.customers = response.content;
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

  private syncCustomerId(): void {
    const search = this.customerSearch.trim().toLowerCase();
    this.filters.customerId = null;

    if (search === '') {
      return;
    }

    for (const customer of this.customers) {
      if (customer.name != null && customer.name.toLowerCase() === search) {
        this.filters.customerId = customer.id ?? null;
        return;
      }
    }
  }
}
