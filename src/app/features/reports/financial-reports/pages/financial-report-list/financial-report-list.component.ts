import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Pagination } from 'src/app/core/models/Pagination';
import { CustomerDTO } from 'src/app/features/organization/customers/dtos/customer-dto';
import { CustomerMapper } from 'src/app/features/organization/customers/mapper/customer.mapper';
import { Customer } from 'src/app/features/organization/customers/models/Customer';
import { CustomerService } from 'src/app/features/organization/customers/services/customer.service';
import { EmployeeDTO } from 'src/app/features/organization/employees/dtos/employee-dto';
import { EmployeeMapper } from 'src/app/features/organization/employees/mapper/employee.mapper';
import { Employee } from 'src/app/features/organization/employees/models/Employee';
import { EmployeeService } from 'src/app/features/organization/employees/services/employee.service';
import { SupplierDTO } from 'src/app/features/organization/suppliers/dtos/supplier-dto';
import { SupplierMapper } from 'src/app/features/organization/suppliers/mapper/supplier.mapper';
import { Supplier } from 'src/app/features/organization/suppliers/models/Supplier';
import { SupplierService } from 'src/app/features/organization/suppliers/services/supplier.service';
import { PaymentMethodDTO } from 'src/app/features/financial/payment-methods/dtos/payment-method-dto';
import { PaymentMethodMapper } from 'src/app/features/financial/payment-methods/mapper/payment-method.mapper';
import { PaymentMethod } from 'src/app/features/financial/payment-methods/models/PaymentMethod';
import { PaymentMethodService } from 'src/app/features/financial/payment-methods/services/payment-method.service';

import { FinancialReportMapper } from '../../mapper/financial-report.mapper';
import { FinancialReport } from '../../models/FinancialReport';
import { FinancialReportFilter } from '../../models/FinancialReportFilter';
import { FinancialReportOption } from '../../models/FinancialReportOption';
import { FinancialReportService } from '../../services/financial-report.service';

@Component({
  selector: 'app-financial-report-list',
  templateUrl: './financial-report-list.component.html',
  styleUrls: ['./financial-report-list.component.css'],
})
export class FinancialReportListComponent implements OnInit {
  filters: FinancialReportFilter = new FinancialReportFilter();

  selectedReportType: string = 'receivables';

  customers: Customer[] = [];

  suppliers: Supplier[] = [];

  employees: Employee[] = [];

  paymentMethods: PaymentMethod[] = [];

  loading: boolean = false;

  chartLoading: boolean = false;

  comparison: FinancialReport = new FinancialReport();

  reportOptions: FinancialReportOption[] = [
    { value: 'receivables', label: 'Contas a Receber', fileName: 'contas-a-receber' },
    { value: 'payables', label: 'Contas a Pagar', fileName: 'contas-a-pagar' },
    { value: 'financial', label: 'Financeiro', fileName: 'financeiro' },
    {
      value: 'summary-customer',
      label: 'Sintético por Cliente',
      fileName: 'sintetico-cliente',
    },
    {
      value: 'summary-supplier',
      label: 'Sintético por Fornecedor',
      fileName: 'sintetico-fornecedor',
    },
    {
      value: 'summary-employee',
      label: 'Sintético por Funcionário',
      fileName: 'sintetico-funcionario',
    },
    { value: 'annual-balance', label: 'Balanço Anual', fileName: 'balanco-anual' },
  ];

  constructor(
    private financialReportService: FinancialReportService,
    private customerService: CustomerService,
    private supplierService: SupplierService,
    private employeeService: EmployeeService,
    private paymentMethodService: PaymentMethodService,
    private messageService: MessageService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadOptions();
    this.loadComparison();
  }

  showPeriodFilters(): boolean {
    return this.selectedReportType !== 'annual-balance';
  }

  showStatusFilter(): boolean {
    return ['receivables', 'payables', 'financial'].includes(this.selectedReportType);
  }

  showCustomerFilter(): boolean {
    return ['receivables', 'financial', 'summary-customer'].includes(this.selectedReportType);
  }

  showSupplierFilter(): boolean {
    return ['payables', 'financial', 'summary-supplier'].includes(this.selectedReportType);
  }

  showEmployeeFilter(): boolean {
    return ['payables', 'financial', 'summary-employee'].includes(this.selectedReportType);
  }

  showAnnualFilter(): boolean {
    return this.selectedReportType === 'annual-balance';
  }

  generate(format: 'pdf' | 'xlsx'): void {
    const validationMessage = this.validateFilters();

    if (validationMessage != null) {
      this.messageService.add({
        severity: 'warn',
        detail: validationMessage,
      });
      return;
    }

    const reportType = this.selectedReportType;
    const filters = FinancialReportMapper.toFilterDTO(this.filters);
    let fileName = reportType;

    for (const option of this.reportOptions) {
      if (option.value === reportType) {
        fileName = option.fileName;
        break;
      }
    }

    fileName = `${fileName}.${format}`;
    this.loading = true;

    this.financialReportService.generate(reportType, format, filters).subscribe({
      next: (blob) => {
        this.loading = false;

        if (format === 'pdf') {
          this.openPdf(blob);
        } else {
          this.download(blob, fileName);
        }
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  clearFilters(): void {
    this.selectedReportType = 'receivables';
    this.filters = new FinancialReportFilter();
    this.loadComparison();
  }

  loadComparison(): void {
    const validationMessage = this.validateFilters();

    if (validationMessage != null) {
      this.messageService.add({
        severity: 'warn',
        detail: validationMessage,
      });
      return;
    }

    const filters = FinancialReportMapper.toFilterDTO(this.filters);
    this.chartLoading = true;

    this.financialReportService.comparison(filters).subscribe({
      next: (data) => {
        this.comparison = FinancialReportMapper.toModel(data);
        this.chartLoading = false;
      },
      error: () => {
        this.chartLoading = false;
      },
    });
  }

  get chartYear(): number {
    if (this.comparison.year) {
      return this.comparison.year;
    }

    if (this.filters.year) {
      return this.filters.year;
    }

    return new Date().getFullYear();
  }

  get chartMaxValue(): number {
    let maximum = 0;

    for (const month of this.comparison.months) {
      if (month.receivableTotal > maximum) {
        maximum = month.receivableTotal;
      }

      if (month.payableTotal > maximum) {
        maximum = month.payableTotal;
      }
    }

    if (maximum <= 0) {
      return 100;
    }

    return Math.ceil(maximum / 100) * 100;
  }

  chartColumnHeight(value: number): string {
    const maximum = this.chartMaxValue;

    if (maximum <= 0 || value <= 0) {
      return '0%';
    }

    let height = (value / maximum) * 100;

    if (height < 2) {
      height = 2;
    }

    return `${height}%`;
  }

  chartTickValue(multiplier: number): number {
    return this.chartMaxValue * multiplier;
  }

  get balanceClass(): string {
    if (this.comparison.balance > 0) {
      return 'positive';
    }

    if (this.comparison.balance < 0) {
      return 'negative';
    }

    return 'neutral';
  }

  hasAuthority(authority: string): boolean {
    return this.authService.hasAuthority(authority);
  }

  private validateFilters(): string | null {
    const filters = this.filters;

    if (filters.startDate && filters.endDate && filters.startDate > filters.endDate) {
      return 'Data inicial não pode ser maior que a data final.';
    }

    if (
      filters.minimumAmount != null &&
      filters.maximumAmount != null &&
      Number(filters.minimumAmount) > Number(filters.maximumAmount)
    ) {
      return 'Valor inicial não pode ser maior que o valor final.';
    }

    if (this.showAnnualFilter() && (!filters.year || Number(filters.year) < 1900)) {
      return 'Informe um ano válido.';
    }

    return null;
  }

  private loadOptions(): void {
    const pagination = new Pagination(0, 1000, 'ASC', 'name');

    this.customerService.list(pagination, '').subscribe((data) => {
      this.customers = [];

      data.content.forEach((dto: CustomerDTO) => {
        const customer = CustomerMapper.toModel(dto);
        this.customers.push(customer);
      });
    });

    this.supplierService.list(pagination, '').subscribe((data) => {
      this.suppliers = [];

      data.content.forEach((dto: SupplierDTO) => {
        const supplier = SupplierMapper.toModel(dto);
        this.suppliers.push(supplier);
      });
    });

    this.employeeService.list(pagination, '').subscribe((data) => {
      this.employees = [];

      data.content.forEach((dto: EmployeeDTO) => {
        const employee = EmployeeMapper.toModel(dto);
        this.employees.push(employee);
      });
    });

    this.paymentMethodService.list(pagination, '').subscribe((data) => {
      this.paymentMethods = [];

      data.content.forEach((dto: PaymentMethodDTO) => {
        const paymentMethod = PaymentMethodMapper.toModel(dto);
        this.paymentMethods.push(paymentMethod);
      });
    });
  }

  private openPdf(blob: Blob): void {
    const pdf = new Blob([blob], { type: 'application/pdf' });
    const objectUrl = URL.createObjectURL(pdf);
    window.open(objectUrl, '_blank');

    setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 60000);
  }

  private download(blob: Blob, fileName: string): void {
    const objectUrl = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = objectUrl;
    anchor.download = fileName;
    anchor.click();
    URL.revokeObjectURL(objectUrl);
  }
}
