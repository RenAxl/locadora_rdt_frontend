import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LazyLoadEvent } from 'primeng/api';
import { catchError, EMPTY } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';
import { PhotoUrlRegistry } from 'src/app/core/utils/photo-preview.util';
import { Item } from 'src/app/features/stocks/items/models/Item';
import { CatalogService } from '../../services/catalog.service';
import { ItemDTO } from 'src/app/features/stocks/items/dtos/item-dto';
import { ItemMapper } from 'src/app/features/stocks/items/mapper/item.mapper';
import { CatalogFilter } from '../../models/CatalogFilter';

@Component({
  selector: 'app-catalog-list',
  templateUrl: './catalog-list.component.html',
  styleUrls: ['./catalog-list.component.css'],
})
export class CatalogListComponent implements OnInit, OnDestroy {
  items: Item[] = [];

  pagination: Pagination = new Pagination(0, 10);

  totalElements: number = 0;

  filterName: string = '';

  filterCategoryId?: number | null;

  loading: boolean = false;

  imageMap: { [key: number]: SafeUrl } = {};
  private imageUrls: PhotoUrlRegistry;

  constructor(
    private catalogService: CatalogService,
    private router: Router,
    sanitizer: DomSanitizer,
  ) {
    this.imageUrls = new PhotoUrlRegistry(sanitizer);
  }

  ngOnInit(): void {
    this.list();
  }

  ngOnDestroy(): void {
    this.imageUrls.clear();
  }

  list(page: number = 0): void {
    this.pagination.page = page;
    this.pagination.linesPerPage = 10;
    this.loading = true;

    this.catalogService
      .list(this.pagination, this.filterName, this.filterCategoryId)
      .subscribe({
        next: (data) => {
          this.items = [];

          data.content.forEach((dto: ItemDTO) => {
            const item = ItemMapper.toModel(dto);
            this.items.push(item);
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
    let rows = 10;

    if (event.first != null) {
      first = event.first;
    }

    if (event.rows != null) {
      rows = event.rows;
    }

    const page = first / rows;
    this.list(page);
  }

  searchCatalog(filter: CatalogFilter): void {
    this.filterName = filter.name;
    this.filterCategoryId = filter.categoryId;
    this.list();
  }

  openDetails(item: Item): void {
    const id = item.id;

    if (id == null) {
      return;
    }

    this.router.navigate(['/catalog', id]);
  }

  private loadImages(): void {
    this.imageUrls.clear();
    this.imageMap = {};

    this.items.forEach((item) => {
      if (!item.id || !item.imageContentType) {
        return;
      }

      this.catalogService
        .getItemImage(item.id)
        .pipe(
          catchError(() => {
            return EMPTY;
          }),
        )
        .subscribe((blob: Blob) => {
          if (!blob || blob.size === 0) {
            return;
          }

          const imageUrl = this.imageUrls.create(blob);

          if (imageUrl) {
            this.imageMap[item.id!] = imageUrl;
          }
        });
    });
  }

}
