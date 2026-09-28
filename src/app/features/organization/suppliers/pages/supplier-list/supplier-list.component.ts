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
import { Supplier } from '../../models/Supplier';
import { SupplierService } from '../../services/supplier.service';
import { SupplierDTO } from '../../dtos/supplier-dto';
import { SupplierMapper } from '../../mapper/supplier.mapper';
import { catchError, EMPTY } from 'rxjs';
import { DataTableColumn } from 'src/app/shared/components/data-table/models/data-table-column';
import { Observable } from 'rxjs';
import { PageResponse } from 'src/app/core/models/page-response';

@Component({
  selector: 'app-supplier-list',
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css'],
})
export class SupplierListComponent implements OnDestroy {
  suppliers: Supplier[] = [];

  pagination: Pagination = new Pagination();

  totalElements: number = 0;

  filterName: string = '';

  loading: boolean = false;

  fieldCustomizationVisible: boolean = false;

  visibleFields: string[] = [
    'name',
    'tradeName',
    'cnpj',
    'phoneNumber',
    'image',
  ];

  availableFields: DataTableColumn[] = [
    { field: 'name', label: 'Nome' },
    { field: 'tradeName', label: 'Nome fantasia' },
    { field: 'companyName', label: 'Razão social' },
    { field: 'cnpj', label: 'CNPJ' },
    { field: 'email', label: 'E-mail' },
    { field: 'phoneNumber', label: 'Telefone' },
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
    { field: 'image', label: 'Imagem' },
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

  @ViewChild('supplierTable') grid!: DataTableComponent;

  detailsVisible = false;

  supplierDetails: Supplier | null = null;

  filesVisible: boolean = false;

  selectedSupplierId?: number;
  selectedSupplierName?: string;

  imageMap: { [key: number]: SafeUrl } = {};
  private photoUrls: PhotoUrlRegistry;

  constructor(
    private supplierService: SupplierService,
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

    this.supplierService.list(this.pagination, this.filterName).subscribe({
      next: (data) => {
        this.suppliers = [];

        data.content.forEach((dto: SupplierDTO) => {
          const supplier = SupplierMapper.toModel(dto);
          this.suppliers.push(supplier);
        });

        this.totalElements = data.totalElements;

        this.loadImages();
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

  searchSupplier(name: string): void {
    this.filterName = name;
    this.list();
  }

  delete(supplier: Supplier): void {
    if (!supplier.id) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.supplierService.delete(supplier.id!).subscribe(() => {
          this.grid.reset();
          this.messageService.add({
            severity: 'success',
            detail: 'Fornecedor excluído com sucesso!',
          });
        });
      },
    });
  }

  openDetails(supplier: Supplier): void {
    const id = supplier.id;

    if (id == null) {
      return;
    }

    this.detailsVisible = true;
    this.supplierDetails = null;

    this.supplierService.findById(id).subscribe({
      next: (details: SupplierDTO) => {
        this.supplierDetails = SupplierMapper.toModel(details);
      },
    });
  }

  openFieldCustomization(): void {
    this.fieldCustomizationVisible = true;
  }

  applyVisibleFields(fields: string[]): void {
    this.visibleFields = [...fields];
  }

  loadSuppliersForExport = (
    pagination: Pagination,
  ): Observable<PageResponse<SupplierDTO>> => {
    return this.supplierService.list(pagination, this.filterName);
  };

  openFilesModal(supplier: Supplier): void {
    this.selectedSupplierId = supplier.id;
    this.selectedSupplierName = supplier.name;
    this.filesVisible = true;
  }

  hasAuthority(authority: string): boolean {
    return this.authService.hasAuthority(authority);
  }

  private loadImages(): void {
    this.photoUrls.clear();
    this.imageMap = {};

    this.suppliers.forEach((supplier) => {
      if (!supplier.id) {
        return;
      }

      this.supplierService
        .getSupplierImage(supplier.id)
        .pipe(
          catchError(() => {
            return EMPTY;
          }),
        )
        .subscribe((blob: Blob) => {
          const photoUrl = this.photoUrls.create(blob);

          if (photoUrl) {
            this.imageMap[supplier.id!] = photoUrl;
          }
        });
    });
  }
}
