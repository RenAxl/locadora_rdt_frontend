import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { CatalogModule } from '../../catalog.module';
import { CatalogService } from '../../services/catalog.service';
import { CatalogItemDetailsComponent } from './catalog-item-details.component';

registerLocaleData(localePt);

describe('CatalogItemDetailsComponent', () => {
  let fixture: ComponentFixture<CatalogItemDetailsComponent>;
  let component: CatalogItemDetailsComponent;
  let catalogService: jasmine.SpyObj<CatalogService>;
  let router: Router;

  beforeEach(async () => {
    catalogService = jasmine.createSpyObj('CatalogService', ['findById', 'getItemImage']);
    catalogService.findById.and.returnValue(of({
      id: 1,
      name: 'Furadeira',
      description: 'Furadeira elétrica',
      category: { id: 4, name: 'Ferramentas' },
      price: 25,
      active: true,
    }));
    catalogService.getItemImage.and.returnValue(of(new Blob()));

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, CatalogModule],
      providers: [
        { provide: CatalogService, useValue: catalogService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ itemId: '1' }) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogItemDetailsComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  });

  it('should display item details without rental selection or checkout', () => {
    fixture.detectChanges();

    const page: HTMLElement = fixture.nativeElement;

    expect(page.querySelector('h1')?.textContent).toBe('Furadeira');
    expect(page.querySelector('.category')?.textContent).toBe('Ferramentas');
    expect(page.querySelector('.description p')?.textContent).toBe('Furadeira elétrica');
    expect(page.querySelector('.price')?.textContent).toContain('25,00');
    expect(page.querySelector('.rental-selection')).toBeNull();
    expect(page.querySelector('app-rental-cart-summary')).toBeNull();
    expect(page.querySelectorAll('button').length).toBe(1);
    expect(component.loading).toBeFalse();
    expect(catalogService.findById).toHaveBeenCalledWith(1);
  });

  it('should display the not found message when the item request fails', () => {
    catalogService.findById.and.returnValue(throwError(() => new Error('Item não encontrado')));

    fixture.detectChanges();

    const page: HTMLElement = fixture.nativeElement;

    expect(page.querySelector('.not-found h2')?.textContent).toBe('Item não encontrado');
    expect(page.querySelector('.details-card')).toBeNull();
    expect(component.loading).toBeFalse();
    expect(catalogService.getItemImage).not.toHaveBeenCalled();
  });

  it('should keep item details available when the image request fails', () => {
    catalogService.getItemImage.and.returnValue(throwError(() => new Error('Imagem indisponível')));

    fixture.detectChanges();

    const page: HTMLElement = fixture.nativeElement;

    expect(page.querySelector('h1')?.textContent).toBe('Furadeira');
    expect(page.querySelector('.image-placeholder')?.textContent).toContain('Sem imagem');
    expect(component.itemNotFound).toBeFalse();
  });

  it('should return to the catalog when the back button is clicked', () => {
    fixture.detectChanges();

    const page: HTMLElement = fixture.nativeElement;
    const button = page.querySelector<HTMLButtonElement>('.back-button');
    button!.click();

    expect(router.navigate).toHaveBeenCalledWith(['/catalog']);
  });
});
