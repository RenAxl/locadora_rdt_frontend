import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { map, Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { PageResponse } from 'src/app/core/models/page-response';
import { Pagination } from 'src/app/core/models/Pagination';
import { DataTableColumn } from 'src/app/shared/components/data-table/models/data-table-column';
import { PaymentMethodMapper } from 'src/app/features/financial/payment-methods/mapper/payment-method.mapper';
import { PaymentMethod } from 'src/app/features/financial/payment-methods/models/PaymentMethod';
import { PaymentMethodService } from 'src/app/features/financial/payment-methods/services/payment-method.service';
import { RentalTypeMapper } from '../../../rental-types/mapper/rental-type.mapper';
import { RentalType } from '../../../rental-types/models/RentalType';
import { RentalTypeService } from '../../../rental-types/services/rental-type.service';
import { RentalCheckoutDTO } from '../../dtos/rental-checkout-dto';
import { RentalDTO } from '../../dtos/rental-dto';
import { RentalMapper } from '../../mapper/rental.mapper';
import { Rental } from '../../models/Rental';
import { RentalFilter } from '../../models/RentalFilter';
import { RentalService } from '../../services/rental.service';

@Component({
  selector: 'app-rental-list',
  templateUrl: './rental-list.component.html',
  styleUrls: ['./rental-list.component.css'],
})
export class RentalListComponent implements OnInit, OnDestroy {
  rentals: Rental[] = [];

  pagination: Pagination = new Pagination(0, 10, 'DESC', 'rental_date');

  totalElements: number = 0;

  filter: RentalFilter = new RentalFilter();

  rentalTypes: RentalType[] = [];

  loading: boolean = false;

  detailsVisible: boolean = false;
  rentalDetails: Rental | null = null;

  overdueVisible: boolean = false;
  overdueRental: Rental | null = null;

  checkoutVisible: boolean = false;
  checkoutRental: Rental | null = null;
  paymentMethods: PaymentMethod[] = [];
  paymentMethodId?: number;
  savingCheckout: boolean = false;

  fieldCustomizationVisible: boolean = false;
  visibleFields: string[] = [
    'id',
    'rentalNumber',
    'customerName',
    'rentalTypeName',
    'status',
    'rentalStartDate',
    'returnForecastDate',
    'effectiveReturnDate',
    'paid',
    'totalAmount',
  ];

  availableFields: DataTableColumn[] = [
    { field: 'id', label: 'Código' },
    { field: 'rentalNumber', label: 'Número' },
    { field: 'customerName', label: 'Cliente' },
    { field: 'rentalTypeName', label: 'Tipo de locação' },
    { field: 'status', label: 'Status' },
    { field: 'paymentMethodName', label: 'Forma de pagamento' },
    { field: 'paid', label: 'Pago' },
    { field: 'registrationDate', label: 'Data do registro' },
    { field: 'rentalStartDate', label: 'Início da locação' },
    { field: 'returnForecastDate', label: 'Previsão de devolução' },
    { field: 'effectiveReturnDate', label: 'Devolução efetiva' },
    { field: 'pickup', label: 'Retirada' },
    { field: 'subtotal', label: 'Subtotal' },
    { field: 'discount', label: 'Desconto' },
    { field: 'shippingFee', label: 'Frete registrado' },
    { field: 'additionalFee', label: 'Acréscimos' },
    { field: 'lateFee', label: 'Multa registrada' },
    { field: 'damageFee', label: 'Danos' },
    { field: 'totalAmount', label: 'Total' },
    { field: 'downPayment', label: 'Entrada' },
    { field: 'remainingAmount', label: 'Saldo' },
    { field: 'createdAt', label: 'Data cadastro' },
    { field: 'updatedAt', label: 'Data atualização' },
    { field: 'createdBy', label: 'Criado por' },
    { field: 'updatedBy', label: 'Atualizado por' },
  ];

  get visibleTableColumns(): DataTableColumn[] {
    const columns: DataTableColumn[] = [];

    for (const column of this.availableFields) {
      if (this.visibleFields.includes(column.field)) {
        columns.push(column);
      }
    }

    return columns;
  }

  documentVisible: boolean = false;
  documentUrl?: SafeResourceUrl;
  documentName: string = '';
  private documentObjectUrl?: string;
  private documentSubscription?: Subscription;

  constructor(
    private rentalService: RentalService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private rentalTypeService: RentalTypeService,
    private paymentMethodService: PaymentMethodService,
  ) {}

  ngOnInit(): void {
    this.loadRentalTypes();
    this.list();
  }

  ngOnDestroy(): void {
    this.closeDocument();
  }

  list(page: number = 0): void {
    this.pagination.page = page;
    this.loading = true;

    this.rentalService.list(this.pagination, this.filter).subscribe({
      next: (data) => {
        this.rentals = [];

        data.content.forEach((dto: RentalDTO) => {
          const rental = RentalMapper.toModel(dto);
          this.rentals.push(rental);
        });

        this.totalElements = data.totalElements;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  changePage(event: LazyLoadEvent): void {
    let first = 0;
    let rows = this.pagination.linesPerPage;

    if (event.first != null) {
      first = event.first;
    }

    if (event.rows != null) {
      rows = event.rows;
    }

    const page = first / rows;
    this.pagination.linesPerPage = rows;
    this.list(page);
  }

  searchRental(): void {
    this.list();
  }

  clearFilters(): void {
    this.filter = new RentalFilter();
    this.list();
  }

  openDetails(rental: Rental): void {
    const id = rental.id;

    if (id == null) {
      return;
    }

    this.detailsVisible = true;
    this.rentalDetails = null;

    this.rentalService.findById(id).subscribe({
      next: (details: RentalDTO) => {
        this.rentalDetails = RentalMapper.toModel(details);
      },
      error: () => {
        this.detailsVisible = false;
      },
    });
  }

  openOverdueDetails(rental: Rental): void {
    this.overdueRental = rental;
    this.overdueVisible = true;
  }

  start(rental: Rental): void {
    const id = rental.id;

    if (id == null || this.savingCheckout) {
      return;
    }

    this.rentalService.findById(id).subscribe((data) => {
      this.checkoutRental = RentalMapper.toModel(data);
      this.paymentMethodId = undefined;
      this.loadPaymentMethods();
      this.checkoutVisible = true;
    });
  }

  confirmCheckout(): void {
    if (this.checkoutRental == null || this.checkoutRental.id == null) {
      return;
    }

    if (this.paymentMethodId == null || this.savingCheckout) {
      return;
    }

    const dto = new RentalCheckoutDTO({
      paymentMethodId: this.paymentMethodId,
    });
    this.savingCheckout = true;

    this.rentalService.start(this.checkoutRental.id, dto).subscribe({
      next: (data) => {
        this.savingCheckout = false;
        this.checkoutVisible = false;
        this.checkoutRental = null;
        this.messageService.add({
          severity: 'success',
          detail: data.message,
        });
        this.list(this.pagination.page);
      },
      error: () => {
        this.savingCheckout = false;
      },
    });
  }

  delete(rental: Rental): void {
    if (rental.id == null) {
      return;
    }

    this.confirmationService.confirm({
      message:
        'Tem certeza que deseja excluir esta locação? As unidades reservadas serão liberadas.',
      accept: () => {
        this.rentalService.delete(rental.id!).subscribe(() => {
          this.list(this.pagination.page);
          this.messageService.add({
            severity: 'success',
            detail: 'Locação excluída com sucesso!',
          });
        });
      },
    });
  }

  openFieldCustomization(): void {
    this.fieldCustomizationVisible = true;
  }

  applyVisibleFields(fields: string[]): void {
    this.visibleFields = [...fields];
  }

  loadRentalsForExport = (
    pagination: Pagination,
  ): Observable<PageResponse<RentalDTO>> => {
    return this.rentalService.list(pagination, this.filter).pipe(
      map((data) => {
        const rentals: RentalDTO[] = [];

        for (const dto of data.content) {
          const rental = {
            ...dto,
            pickup: 'Na loja. O envio por aplicativo, como Uber, pode ser solicitado.',
          };
          rentals.push(rental);
        }

        return {
          ...data,
          content: rentals,
        };
      }),
    );
  };

  generateReceipt(rental: Rental): void {
    if (rental.id == null) {
      return;
    }

    this.closeDocument();
    this.documentName = 'Recibo da locação';
    this.documentSubscription = this.rentalService
      .receipt(rental.id)
      .subscribe({
        next: (pdf) => {
          this.openDocument(pdf);
        },
      });
  }

  generateFiscalCoupon(rental: Rental): void {
    if (rental.id == null) {
      return;
    }

    this.closeDocument();
    this.documentName = 'Cupom fiscal da locação';
    this.documentSubscription = this.rentalService
      .fiscalCoupon(rental.id)
      .subscribe({
        next: (pdf) => {
          this.openDocument(pdf);
        },
      });
  }

  openDocument(pdf: Blob): void {
    if (pdf == null || pdf.size === 0) {
      return;
    }

    const blob = new Blob([pdf], { type: 'application/pdf' });
    this.documentObjectUrl = URL.createObjectURL(blob);
    this.documentUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      this.documentObjectUrl,
    );
    this.documentVisible = true;
  }

  closeDocument(): void {
    if (this.documentSubscription != null) {
      this.documentSubscription.unsubscribe();
      this.documentSubscription = undefined;
    }

    if (this.documentObjectUrl != null) {
      URL.revokeObjectURL(this.documentObjectUrl);
      this.documentObjectUrl = undefined;
    }

    this.documentVisible = false;
    this.documentUrl = undefined;
    this.documentName = '';
  }

  hasAuthority(authority: string): boolean {
    return this.authService.hasAuthority(authority);
  }

  private loadRentalTypes(): void {
    this.rentalTypeService
      .list(new Pagination(0, 100), '')
      .subscribe((data) => {
        this.rentalTypes = [];

        for (const dto of data.content) {
          this.rentalTypes.push(RentalTypeMapper.toModel(dto));
        }
      });
  }

  private loadPaymentMethods(): void {
    this.paymentMethods = [];

    this.paymentMethodService
      .list(new Pagination(0, 100), '')
      .subscribe((data) => {
        for (const dto of data.content) {
          this.paymentMethods.push(PaymentMethodMapper.toModel(dto));
        }
      });
  }
}
