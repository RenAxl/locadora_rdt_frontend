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
import { Category } from '../../models/Category';
import { CategoryService } from '../../services/category.service';
import { CategoryDTO } from '../../dtos/category-dto';
import { CategoryMapper } from '../../mapper/category.mapper';
import { catchError, EMPTY } from 'rxjs';
import { DataTableColumn } from 'src/app/shared/components/data-table/models/data-table-column';
import { Observable } from 'rxjs';
import { PageResponse } from 'src/app/core/models/page-response';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css'],
})
export class CategoryListComponent implements OnDestroy {
  categories: Category[] = [];

  pagination: Pagination = new Pagination();

  totalElements: number = 0;

  filterName: string = '';

  selectedCategories: Category[] = [];

  selectedCategoryIds: number[] = [];

  loading: boolean = false;

  fieldCustomizationVisible: boolean = false;

  visibleFields: string[] = ['name', 'image'];

  availableFields: DataTableColumn[] = [
    { field: 'name', label: 'Nome' },
    { field: 'active', label: 'Ativa' },
    { field: 'createdAt', label: 'Data cadastro' },
    { field: 'updatedAt', label: 'Data atualização' },
    { field: 'createdBy', label: 'Criado por' },
    { field: 'updatedBy', label: 'Atualizado por' },
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

  @ViewChild('categoryTable') grid!: DataTableComponent;

  detailsVisible = false;

  categoryDetails: Category | null = null;

  imageMap: { [key: number]: SafeUrl } = {};
  private imageUrls: PhotoUrlRegistry;

  constructor(
    private categoryService: CategoryService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
  ) {
    this.imageUrls = new PhotoUrlRegistry(sanitizer);
  }

  ngOnDestroy(): void {
    this.imageUrls.clear();
  }

  list(page: number = 0): void {
    this.pagination.page = page;
    this.loading = true;

    this.categoryService.list(this.pagination, this.filterName).subscribe({
      next: (data) => {
        this.categories = [];

        data.content.forEach((dto: CategoryDTO) => {
          const category = CategoryMapper.toModel(dto);
          this.categories.push(category);
        });

        this.totalElements = data.totalElements;

        this.selectedCategories = [];
        this.categories.forEach((category) => {
          if (
            category.id != null &&
            this.selectedCategoryIds.includes(category.id)
          ) {
            this.selectedCategories.push(category);
          }
        });

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

  searchCategory(name: string): void {
    this.filterName = name;
    this.list();
  }

  delete(category: Category): void {
    if (!category.id) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.categoryService.delete(category.id!).subscribe(() => {
          this.grid.reset();
          this.messageService.add({
            severity: 'success',
            detail: 'Categoria excluída com sucesso!',
          });
        });
      },
    });
  }

  onSelectionChange(categories: Category[]): void {
    this.selectedCategories = categories;

    this.categories.forEach((category) => {
      if (category.id != null) {
        const index = this.selectedCategoryIds.indexOf(category.id);

        if (index !== -1) {
          this.selectedCategoryIds.splice(index, 1);
        }
      }
    });

    categories.forEach((category) => {
      if (
        category.id != null &&
        !this.selectedCategoryIds.includes(category.id)
      ) {
        this.selectedCategoryIds.push(category.id);
      }
    });
  }

  deleteSelectedCategories(): void {
    if (!this.selectedCategoryIds || this.selectedCategoryIds.length === 0) {
      return;
    }

    const ids = [...this.selectedCategoryIds];

    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir ${ids.length} categoria(s)?`,
      accept: () => {
        this.categoryService.deleteAll(ids).subscribe(() => {
          this.selectedCategoryIds = [];
          this.selectedCategories = [];

          this.grid.reset();

          this.messageService.add({
            severity: 'success',
            detail: 'Categorias excluídas com sucesso!',
          });
        });
      },
    });
  }

  openDetails(category: Category): void {
    const id = category.id;

    if (id == null) {
      return;
    }

    this.detailsVisible = true;
    this.categoryDetails = null;

    this.categoryService.findById(id).subscribe({
      next: (details: CategoryDTO) => {
        this.categoryDetails = CategoryMapper.toModel(details);
      },
    });
  }

  toggleActive(category: Category): void {
    if (!category.id) {
      return;
    }

    const newStatus = !category.active;

    this.categoryService.changeActive(category.id, newStatus).subscribe({
      next: () => {
        category.active = newStatus;

        this.messageService.add({
          severity: 'success',
          detail: `Categoria ${newStatus ? 'ativada' : 'desativada'} com sucesso!`,
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

  loadCategoriesForExport = (
    pagination: Pagination,
  ): Observable<PageResponse<CategoryDTO>> => {
    return this.categoryService.list(pagination, this.filterName);
  };

  hasAuthority(authority: string): boolean {
    return this.authService.hasAuthority(authority);
  }

  private loadImages(): void {
    this.imageUrls.clear();
    this.imageMap = {};

    this.categories.forEach((category) => {
      if (!category.id || !category.imageContentType) {
        return;
      }

      this.categoryService
        .getCategoryImage(category.id)
        .pipe(
          catchError(() => {
            return EMPTY;
          }),
        )
        .subscribe((blob: Blob) => {
          const imageUrl = this.imageUrls.create(blob);

          if (imageUrl) {
            this.imageMap[category.id!] = imageUrl;
          }
        });
    });
  }
}
