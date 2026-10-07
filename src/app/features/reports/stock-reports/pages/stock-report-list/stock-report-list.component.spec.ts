import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { StockReportService } from '../../services/stock-report.service';
import { StockReportListComponent } from './stock-report-list.component';

describe('StockReportListComponent', () => {
  let fixture: ComponentFixture<StockReportListComponent>;
  let component: StockReportListComponent;
  let service: jasmine.SpyObj<StockReportService>;
  let messages: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    service = jasmine.createSpyObj('StockReportService', ['generate', 'summary', 'options']);
    service.options.and.returnValue(of({ categories: [{ id: 1, name: 'Ferramentas' }], items: [
      { id: 2, name: 'Furadeira', categoryId: 1 }, { id: 3, name: 'Notebook', categoryId: 4 },
    ] }));
    service.summary.and.returnValue(of({ itemCount: 2, totalQuantity: 5, availableQuantity: 3, maintenanceQuantity: 2 }));
    service.generate.and.returnValue(of(new Blob()));
    messages = jasmine.createSpyObj('MessageService', ['add']);
    const auth = jasmine.createSpyObj<AuthService>('AuthService', ['hasAuthority']);
    auth.hasAuthority.and.returnValue(true);
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule], declarations: [StockReportListComponent],
      providers: [
        { provide: StockReportService, useValue: service },
        { provide: MessageService, useValue: messages },
        { provide: AuthService, useValue: auth },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(StockReportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should load report options and display availability', () => {
    expect(service.options).toHaveBeenCalled();
    expect(service.summary).toHaveBeenCalled();
    expect(component.summary.totalQuantity).toBe(5);
    expect(component.barWidth(3)).toBe('60%');
    expect(fixture.nativeElement.querySelector('#stock-report-type').options.length).toBe(4);
  });

  it('should show dates only for movements and reset hidden fields', async () => {
    component.filters.status = 'DAMAGED';
    component.filters.active = false;
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('#stock-report-type');
    select.value = 'movements';
    select.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component.filters.status).toBe('ALL');
    expect(component.filters.active).toBeTrue();
    expect(fixture.nativeElement.querySelector('#stock-report-start-date')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('#stock-report-status')).toBeNull();
    expect(fixture.nativeElement.querySelector('#stock-report-active')).toBeNull();
  });

  it('should filter item options by category and clear the previous item', () => {
    component.filters.itemId = 3;
    component.filters.categoryId = 1;
    component.changeCategory();
    expect(component.filters.itemId).toBeNull();
    expect(component.filteredItems.map(item => item.id)).toEqual([2]);
  });

  it('should clear situation when selecting retired units', () => {
    component.filters.status = 'AVAILABLE';
    component.filters.active = false;
    component.changeActiveFilter();
    expect(component.filters.status).toBe('ALL');
  });

  it('should reject an inverted movement period', () => {
    component.selectedReportType = 'movements';
    component.filters.startDate = '2026-02-01';
    component.filters.endDate = '2026-01-01';
    component.generate('pdf');
    expect(service.generate).not.toHaveBeenCalled();
    expect(messages.add).toHaveBeenCalled();
    expect(component.loading).toBeFalse();
  });

  it('should download Excel with the selected report name', () => {
    const createUrl = spyOn(URL, 'createObjectURL').and.returnValue('blob:test');
    spyOn(URL, 'revokeObjectURL');
    const click = spyOn(HTMLAnchorElement.prototype, 'click');
    component.selectedReportType = 'low-stock';
    component.generate('xlsx');
    expect(service.generate.calls.mostRecent().args[0]).toBe('low-stock');
    expect(createUrl).toHaveBeenCalled();
    const anchor = click.calls.mostRecent().object as HTMLAnchorElement;
    expect(anchor.download).toBe('low-stock.xlsx');
    expect(component.loading).toBeFalse();
  });

  it('should download PDF when a new tab cannot be opened', () => {
    spyOn(URL, 'createObjectURL').and.returnValue('blob:test');
    spyOn(URL, 'revokeObjectURL');
    spyOn(window, 'open').and.returnValue(null);
    const click = spyOn(HTMLAnchorElement.prototype, 'click');
    component.generate('pdf');
    const anchor = click.calls.mostRecent().object as HTMLAnchorElement;
    expect(anchor.download).toBe('balances.pdf');
  });

  it('should release loading after a generation error', () => {
    service.generate.and.returnValue(throwError(() => new Error('Falha no relatório')));
    component.generate('xlsx');
    expect(component.loading).toBeFalse();
  });

  it('should release summary loading after an error', () => {
    service.summary.and.returnValue(throwError(() => new Error('Falha no resumo')));
    component.loadSummary();
    expect(component.summaryLoading).toBeFalse();
  });

  it('should reset filters and refresh the summary', () => {
    component.selectedReportType = 'movements';
    component.filters.itemId = 2;
    component.filters.startDate = '2026-01-01';
    component.clearFilters();
    expect(component.selectedReportType).toBe('balances');
    expect(component.filters.itemId).toBeNull();
    expect(component.filters.startDate).toBeNull();
    expect(component.filters.active).toBeTrue();
    expect(service.summary.calls.count()).toBe(2);
  });
});
