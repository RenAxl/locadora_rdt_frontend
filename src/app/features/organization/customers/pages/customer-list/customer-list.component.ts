import { Component, OnDestroy, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { AuthService } from 'src/app/core/auth/services/auth.service';
import { Pagination } from 'src/app/core/models/Pagination';
import {
  ConfirmationService,
  LazyLoadEvent,
  MessageService,
} from 'primeng/api';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';

import { PhotoUrlRegistry } from 'src/app/core/utils/photo-preview.util';
import { Customer } from '../../models/Customer';
import { CustomerService } from '../../services/customer.service';
import { CustomerDTO } from '../../dtos/customer-dto';
import { CustomerMapper } from '../../mapper/customer.mapper';
import { catchError, EMPTY } from 'rxjs';
import { DataTableColumn } from 'src/app/shared/components/data-table/models/data-table-column';
import { Observable } from 'rxjs';
import { PageResponse } from 'src/app/core/models/page-response';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css'],
})
export class CustomerListComponent implements OnDestroy {
  customers: Customer[] = [];

  pagination: Pagination = new Pagination();

  totalElements: number = 0;

  filterName: string = '';

  selectedCustomers: Customer[] = [];

  selectedCustomerIds: number[] = [];

  loading: boolean = false;

  fieldCustomizationVisible: boolean = false;

  visibleFields: string[] = ['name', 'email', 'phone', 'photo'];

  availableFields: DataTableColumn[] = [
    { field: 'name', label: 'Nome' },
    { field: 'email', label: 'E-mail' },
    { field: 'phone', label: 'Telefone' },
    { field: 'active', label: 'Ativo' },
    { field: 'createdAt', label: 'Data cadastro' },
    { field: 'updatedAt', label: 'Data atualização' },
    { field: 'createdBy', label: 'Criado por' },
    { field: 'updatedBy', label: 'Atualizado por' },
    { field: 'address.street', label: 'Rua' },
    { field: 'address.number', label: 'Número' },
    { field: 'address.complement', label: 'Complemento' },
    { field: 'address.neighborhood', label: 'Bairro' },
    { field: 'address.city', label: 'Cidade' },
    { field: 'address.state', label: 'UF' },
    { field: 'address.zipCode', label: 'CEP' },
    { field: 'photo', label: 'Foto' },
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

  @ViewChild('customerTable') grid!: DataTableComponent;

  detailsVisible = false;

  customerDetails: Customer | null = null;

  filesVisible: boolean = false;

  selectedCustomerId?: number;
  selectedCustomerName?: string;

  photoMap: { [key: number]: SafeUrl } = {};
  private photoUrls: PhotoUrlRegistry;

  constructor(
    private customerService: CustomerService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
  ) {
    this.photoUrls = new PhotoUrlRegistry(sanitizer);
  }

  ngOnDestroy(): void {
    this.photoUrls.clear();
  }

  list(page: number = 0): void {
    this.pagination.page = page;
    this.loading = true;

    this.customerService.list(this.pagination, this.filterName).subscribe({
      next: (data) => {
        this.customers = [];

        data.content.forEach((dto: CustomerDTO) => {
          const customer = CustomerMapper.toModel(dto);
          this.customers.push(customer);
        });

        this.totalElements = data.totalElements;

        this.selectedCustomers = [];
        this.customers.forEach((customer) => {
          if (
            customer.id != null &&
            this.selectedCustomerIds.includes(customer.id)
          ) {
            this.selectedCustomers.push(customer);
          }
        });

        this.loadPhotos();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  changePage(event: LazyLoadEvent): void {
    let first = 0;
    let rows = 1;

    if (event.first != null) {
      first = event.first;
    }

    if (event.rows != null) {
      rows = event.rows;
    }

    if (typeof event.sortField === 'string') {
      this.pagination.orderBy = event.sortField;
    }

    if (event.sortOrder === -1) {
      this.pagination.direction = 'DESC';
    } else {
      this.pagination.direction = 'ASC';
    }

    const page = first / rows;
    this.pagination.linesPerPage = rows;
    this.list(page);
  }

  searchCustomer(name: string): void {
    this.filterName = name;
    this.list();
  }

  delete(customer: Customer): void {
    if (!customer.id) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.customerService.delete(customer.id!).subscribe(() => {
          this.grid.reset();
          this.messageService.add({
            severity: 'success',
            detail: 'Cliente excluído com sucesso!',
          });
        });
      },
    });
  }

  onSelectionChange(customers: Customer[]): void {
    this.selectedCustomers = customers;

    this.customers.forEach((customer) => {
      if (customer.id != null) {
        const index = this.selectedCustomerIds.indexOf(customer.id);

        if (index !== -1) {
          this.selectedCustomerIds.splice(index, 1);
        }
      }
    });

    customers.forEach((customer) => {
      if (
        customer.id != null &&
        !this.selectedCustomerIds.includes(customer.id)
      ) {
        this.selectedCustomerIds.push(customer.id);
      }
    });
  }

  deleteSelectedCustomers(): void {
    if (!this.selectedCustomerIds || this.selectedCustomerIds.length === 0) {
      return;
    }

    const ids = [...this.selectedCustomerIds];

    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir ${ids.length} cliente(s)?`,
      accept: () => {
        this.customerService.deleteAll(ids).subscribe(() => {
          this.selectedCustomerIds = [];
          this.selectedCustomers = [];

          this.grid.reset();

          this.messageService.add({
            severity: 'success',
            detail: 'Clientes excluídos com sucesso!',
          });
        });
      },
    });
  }

  openDetails(customer: Customer): void {
    const id = customer.id;

    if (id == null) {
      return;
    }

    this.detailsVisible = true;
    this.customerDetails = null;

    this.customerService.findById(id).subscribe({
      next: (details: CustomerDTO) => {
        this.customerDetails = CustomerMapper.toModel(details);
      },
    });
  }

  toggleActive(customer: Customer): void {
    if (!customer.id) {
      return;
    }

    const newStatus = !customer.active;

    this.customerService.changeActive(customer.id, newStatus).subscribe({
      next: () => {
        customer.active = newStatus;

        this.messageService.add({
          severity: 'success',
          detail: `Cliente ${newStatus ? 'ativado' : 'desativado'} com sucesso!`,
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

  loadCustomersForExport = (
    pagination: Pagination,
  ): Observable<PageResponse<CustomerDTO>> => {
    return this.customerService.list(pagination, this.filterName);
  };

  openFilesModal(customer: Customer): void {
    this.selectedCustomerId = customer.id;
    this.selectedCustomerName = customer.name;
    this.filesVisible = true;
  }

  hasAuthority(authority: string): boolean {
    return this.authService.hasAuthority(authority);
  }

  private loadPhotos(): void {
    this.photoUrls.clear();
    this.photoMap = {};

    this.customers.forEach((customer) => {
      if (!customer.id) {
        return;
      }

      this.customerService
        .getCustomerPhoto(customer.id)
        .pipe(
          catchError(() => {
            return EMPTY;
          }),
        )
        .subscribe((blob: Blob) => {
          const photoUrl = this.photoUrls.create(blob);

          if (photoUrl) {
            this.photoMap[customer.id!] = photoUrl;
          }
        });
    });
  }
}
