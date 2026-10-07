import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Pagination } from 'src/app/core/models/Pagination';
import { Category } from 'src/app/features/stocks/categories/models/Category';
import { CategoryService } from 'src/app/features/stocks/categories/services/category.service';
import { CategoryDTO } from 'src/app/features/stocks/categories/dtos/category-dto';
import { CategoryMapper } from 'src/app/features/stocks/categories/mapper/category.mapper';
import { CatalogFilter } from '../../models/CatalogFilter';

@Component({
  selector: 'app-catalog-filter',
  templateUrl: './catalog-filter.component.html',
  styleUrls: ['./catalog-filter.component.css'],
})
export class CatalogFilterComponent implements OnInit {
  @Output() search = new EventEmitter<CatalogFilter>();

  nameFilter: string = '';

  categoryId: number | null = null;

  categories: Category[] = [];

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  searchCatalog(): void {
    const filter = new CatalogFilter({
      name: this.nameFilter,
      categoryId: this.categoryId,
    });

    this.search.emit(filter);
  }

  formClear(): void {
    this.nameFilter = '';
    this.categoryId = null;
    this.searchCatalog();
  }

  loadCategories(): void {
    const pagination = new Pagination(0, 1000, 'ASC', 'name');

    this.categoryService.list(pagination, '').subscribe({
      next: (data) => {
        this.categories = [];

        if (data != null && data.content != null) {
          data.content.forEach((dto: CategoryDTO) => {
            const category = CategoryMapper.toModel(dto);
            this.categories.push(category);
          });
        }
      },
      error: () => {
        this.categories = [];
      },
    });
  }
}
