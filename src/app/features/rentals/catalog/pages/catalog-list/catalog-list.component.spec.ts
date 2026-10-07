import { TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Pagination } from 'src/app/core/models/Pagination';
import { ItemDTO } from 'src/app/features/stocks/items/dtos/item-dto';
import { Item } from 'src/app/features/stocks/items/models/Item';
import { CatalogFilter } from '../../models/CatalogFilter';
import { CatalogService } from '../../services/catalog.service';
import { CatalogListComponent } from './catalog-list.component';

describe('CatalogListComponent', () => {
  let component: CatalogListComponent;
  let catalogService: jasmine.SpyObj<CatalogService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    catalogService = jasmine.createSpyObj('CatalogService', ['list', 'getItemImage']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    component = new CatalogListComponent(
      catalogService,
      router,
      TestBed.inject(DomSanitizer),
    );
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should map catalog DTOs without losing item fields', () => {
    const dto = new ItemDTO({
      id: 1,
      name: 'Furadeira',
      description: 'Furadeira elétrica',
      category: { id: 4, name: 'Ferramentas' },
      price: 25,
      active: false,
      createdAt: new Date('2026-10-07T12:00:00Z'),
    });

    catalogService.list.and.returnValue(of({ content: [dto], totalElements: 9 }));

    component.list();

    expect(component.items[0] instanceof Item).toBeTrue();
    expect(component.items[0].description).toBe('Furadeira elétrica');
    expect(component.items[0].category?.name).toBe('Ferramentas');
    expect(component.items[0].price).toBe(25);
    expect(component.items[0].active).toBeFalse();
    expect(component.items[0].createdAt instanceof Date).toBeTrue();
    expect(component.totalElements).toBe(9);
  });

  it('should load the page selected by the paginator with ten cards', () => {
    catalogService.list.and.returnValue(of({ content: [], totalElements: 0 }));

    component.changePage({ first: 20, rows: 10 });

    expect(component.pagination.page).toBe(2);
    expect(component.pagination.linesPerPage).toBe(10);
    expect(catalogService.list).toHaveBeenCalledWith(component.pagination, '', undefined);
  });

  it('should search by name and category starting from the first page', () => {
    catalogService.list.and.returnValue(of({ content: [], totalElements: 0 }));
    component.pagination.page = 2;

    const filter = new CatalogFilter({ name: 'Furadeira', categoryId: 4 });

    component.searchCatalog(filter);

    expect(component.pagination.page).toBe(0);
    expect(catalogService.list).toHaveBeenCalledWith(
      jasmine.any(Pagination), 'Furadeira', 4,
    );
  });

  it('should finish loading when the catalog request fails', () => {
    catalogService.list.and.returnValue(throwError(() => new Error('Falha na consulta')));

    component.list();

    expect(component.loading).toBeFalse();
  });

  it('should navigate to the selected item details', () => {
    const item = new Item();
    item.id = 1;

    component.openDetails(item);

    expect(router.navigate).toHaveBeenCalledWith(['/catalog', 1]);
  });
});
