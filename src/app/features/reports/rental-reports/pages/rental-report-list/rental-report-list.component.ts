import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';

import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Pagination } from 'src/app/core/models/Pagination';
import { CustomerDTO } from 'src/app/features/organization/customers/dtos/customer-dto';
import { CustomerMapper } from 'src/app/features/organization/customers/mapper/customer.mapper';
import { Customer } from 'src/app/features/organization/customers/models/Customer';
import { CustomerService } from 'src/app/features/organization/customers/services/customer.service';
import { RentalTypeDTO } from 'src/app/features/rentals/rental-types/dtos/rental-type-dto';
import { RentalTypeMapper } from 'src/app/features/rentals/rental-types/mapper/rental-type.mapper';
import { RentalType } from 'src/app/features/rentals/rental-types/models/RentalType';
import { RentalTypeService } from 'src/app/features/rentals/rental-types/services/rental-type.service';
import { PaymentMethodDTO } from 'src/app/features/financial/payment-methods/dtos/payment-method-dto';
import { PaymentMethodMapper } from 'src/app/features/financial/payment-methods/mapper/payment-method.mapper';
import { PaymentMethod } from 'src/app/features/financial/payment-methods/models/PaymentMethod';
import { PaymentMethodService } from 'src/app/features/financial/payment-methods/services/payment-method.service';

import { RentalReportMapper } from '../../mapper/rental-report.mapper';
import { RentalReport } from '../../models/RentalReport';
import { RentalReportFilter } from '../../models/RentalReportFilter';
import { RentalReportOption } from '../../models/RentalReportOption';
import { RentalReportService } from '../../services/rental-report.service';

@Component({
  selector: 'app-rental-report-list',
  templateUrl: './rental-report-list.component.html',
  styleUrls: ['./rental-report-list.component.css'],
})
export class RentalReportListComponent implements OnInit {
  filters: RentalReportFilter = new RentalReportFilter();

  selectedReportType: string = 'rentals';

  customers: Customer[] = [];

  rentalTypes: RentalType[] = [];

  paymentMethods: PaymentMethod[] = [];

  loading: boolean = false;

  chartLoading: boolean = false;

  comparison: RentalReport = new RentalReport();

  reportOptions: RentalReportOption[] = [
    { value: 'rentals', label: 'Locações', fileName: 'locacoes' },
    { value: 'summary-customer', label: 'Locações por Cliente', fileName: 'locacoes-por-cliente' },
    { value: 'annual-summary', label: 'Resumo Anual de Locações', fileName: 'resumo-anual-locacoes' },
  ];

  constructor(
    private rentalReportService: RentalReportService,
    private customerService: CustomerService,
    private rentalTypeService: RentalTypeService,
    private paymentMethodService: PaymentMethodService,
    private messageService: MessageService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadOptions();
    this.loadComparison();
  }

  showPeriodFilters(): boolean {
    return this.selectedReportType !== 'annual-summary';
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
    const filters = RentalReportMapper.toFilterDTO(this.filters);
    let fileName = reportType;

    for (const option of this.reportOptions) {
      if (option.value === reportType) {
        fileName = option.fileName;
        break;
      }
    }

    fileName = `${fileName}.${format}`;
    this.loading = true;

    this.rentalReportService.generate(reportType, format, filters).subscribe({
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
    this.selectedReportType = 'rentals';
    this.filters = new RentalReportFilter();
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

    const filters = RentalReportMapper.toFilterDTO(this.filters);
    this.chartLoading = true;

    this.rentalReportService.comparison(filters).subscribe({
      next: (data) => {
        this.comparison = RentalReportMapper.toModel(data);
        this.chartLoading = false;
      },
      error: () => {
        this.comparison = new RentalReport();
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
      if (month.rentalTotal > maximum) {
        maximum = month.rentalTotal;
      }

      if (month.paidTotal > maximum) {
        maximum = month.paidTotal;
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

    if (!filters.year || Number(filters.year) < 1900 || Number(filters.year) > 9999) {
      return 'Informe um ano entre 1900 e 9999.';
    }

    if ((filters.minimumAmount != null && Number(filters.minimumAmount) < 0) ||
        (filters.maximumAmount != null && Number(filters.maximumAmount) < 0)) {
      return 'Os valores não podem ser negativos.';
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

    this.rentalTypeService.list(pagination, '').subscribe((data) => {
      this.rentalTypes = [];

      data.content.forEach((dto: RentalTypeDTO) => {
        const rentalType = RentalTypeMapper.toModel(dto);
        this.rentalTypes.push(rentalType);
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
