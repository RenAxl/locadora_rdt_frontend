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
import { Item } from '../../models/Item';
import { ItemService } from '../../services/item.service';
import { ItemDTO } from '../../dtos/item-dto';
import { ItemMapper } from '../../mapper/item.mapper';
import { catchError, EMPTY } from 'rxjs';
import { DataTableColumn } from 'src/app/shared/components/data-table/models/data-table-column';
import { Observable } from 'rxjs';
import { PageResponse } from 'src/app/core/models/page-response';

@Component({
  selector: 'app-item-list',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.css'],
})
export class ItemListComponent implements OnDestroy {
  items: Item[] = [];

  pagination: Pagination = new Pagination();

  totalElements: number = 0;

  filterName: string = '';

  selectedItems: Item[] = [];

  selectedItemIds: number[] = [];

  loading: boolean = false;

  fieldCustomizationVisible: boolean = false;

  visibleFields: string[] = ['name', 'category.name', 'price', 'image'];

  availableFields: DataTableColumn[] = [
    { field: 'name', label: 'Nome' },
    { field: 'description', label: 'Descrição' },
    { field: 'category.name', label: 'Categoria' },
    { field: 'price', label: 'Preço' },
    { field: 'active', label: 'Ativo' },
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

  @ViewChild('itemTable') grid!: DataTableComponent;

  detailsVisible = false;

  itemDetails: Item | null = null;

  imageMap: { [key: number]: SafeUrl } = {};
  private imageUrls: PhotoUrlRegistry;

  constructor(
    private itemService: ItemService,
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

    this.itemService.list(this.pagination, this.filterName).subscribe({
      next: (data) => {
        this.items = [];

        data.content.forEach((dto: ItemDTO) => {
          const item = ItemMapper.toModel(dto);
          this.items.push(item);
        });

        this.totalElements = data.totalElements;

        this.selectedItems = [];
        this.items.forEach((item) => {
          if (
            item.id != null &&
            this.selectedItemIds.includes(item.id)
          ) {
            this.selectedItems.push(item);
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

  searchItem(name: string): void {
    this.filterName = name;
    this.list();
  }

  delete(item: Item): void {
    if (!item.id) {
      return;
    }

    this.confirmationService.confirm({
      message: 'Tem certeza que deseja excluir?',
      accept: () => {
        this.itemService.delete(item.id!).subscribe(() => {
          this.grid.reset();
          this.messageService.add({
            severity: 'success',
            detail: 'Item excluído com sucesso!',
          });
        });
      },
    });
  }

  onSelectionChange(items: Item[]): void {
    this.selectedItems = items;

    this.items.forEach((item) => {
      if (item.id != null) {
        const index = this.selectedItemIds.indexOf(item.id);

        if (index !== -1) {
          this.selectedItemIds.splice(index, 1);
        }
      }
    });

    items.forEach((item) => {
      if (
        item.id != null &&
        !this.selectedItemIds.includes(item.id)
      ) {
        this.selectedItemIds.push(item.id);
      }
    });
  }

  deleteSelectedItems(): void {
    if (!this.selectedItemIds || this.selectedItemIds.length === 0) {
      return;
    }

    const ids = [...this.selectedItemIds];

    this.confirmationService.confirm({
      message: `Tem certeza que deseja excluir ${ids.length} item(ns)?`,
      accept: () => {
        this.itemService.deleteAll(ids).subscribe(() => {
          this.selectedItemIds = [];
          this.selectedItems = [];

          this.grid.reset();

          this.messageService.add({
            severity: 'success',
            detail: 'Itens excluídos com sucesso!',
          });
        });
      },
    });
  }

  openDetails(item: Item): void {
    const id = item.id;

    if (id == null) {
      return;
    }

    this.detailsVisible = true;
    this.itemDetails = null;

    this.itemService.findById(id).subscribe({
      next: (details: ItemDTO) => {
        this.itemDetails = ItemMapper.toModel(details);
      },
    });
  }

  toggleActive(item: Item): void {
    if (!item.id) {
      return;
    }

    const newStatus = !item.active;

    this.itemService.changeActive(item.id, newStatus).subscribe({
      next: () => {
        item.active = newStatus;

        this.messageService.add({
          severity: 'success',
          detail: `Item ${newStatus ? 'ativado' : 'desativado'} com sucesso!`,
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

  loadItemsForExport = (
    pagination: Pagination,
  ): Observable<PageResponse<ItemDTO>> => {
    return this.itemService.list(pagination, this.filterName);
  };

  hasAuthority(authority: string): boolean {
    return this.authService.hasAuthority(authority);
  }

  private loadImages(): void {
    this.imageUrls.clear();
    this.imageMap = {};

    this.items.forEach((item) => {
      if (!item.id || !item.imageContentType) {
        return;
      }

      this.itemService
        .getItemImage(item.id)
        .pipe(
          catchError(() => {
            return EMPTY;
          }),
        )
        .subscribe((blob: Blob) => {
          const imageUrl = this.imageUrls.create(blob);

          if (imageUrl) {
            this.imageMap[item.id!] = imageUrl;
          }
        });
    });
  }
}
