import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { DataTableComponent } from 'src/app/shared/components/data-table/data-table.component';
import { ItemUnit } from '../../models/ItemUnit';
import { ItemUnitService } from '../../services/item-unit.service';
import { ItemUnitListComponent } from './item-unit-list.component';

describe('ItemUnitListComponent active filter', () => {
  let fixture: ComponentFixture<ItemUnitListComponent>;
  let component: ItemUnitListComponent;
  let units: jasmine.SpyObj<ItemUnitService>;
  let confirmation: jasmine.SpyObj<ConfirmationService>;
  let grid: jasmine.SpyObj<DataTableComponent>;

  beforeEach(async () => {
    units = jasmine.createSpyObj('ItemUnitService', ['list', 'delete', 'deleteAll', 'changeActive']);
    units.list.and.returnValue(of({ content: [], totalElements: 0 }));
    units.delete.and.returnValue(of(undefined));
    units.deleteAll.and.returnValue(of(undefined));
    units.changeActive.and.returnValue(of(undefined));
    confirmation = jasmine.createSpyObj('ConfirmationService', ['confirm']);
    const auth = jasmine.createSpyObj<AuthService>('AuthService', ['hasAuthority']);
    auth.hasAuthority.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule],
      declarations: [ItemUnitListComponent],
      providers: [
        { provide: ItemUnitService, useValue: units },
        { provide: ConfirmationService, useValue: confirmation },
        { provide: MessageService, useValue: jasmine.createSpyObj('MessageService', ['add']) },
        { provide: AuthService, useValue: auth },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(ItemUnitListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    grid = jasmine.createSpyObj('DataTableComponent', ['reset']);
    grid.reset.and.callFake(() => component.list());
    component.grid = grid;
  });

  it('should list active units by default', () => {
    component.list();
    expect(units.list).toHaveBeenCalledWith(component.pagination, '', undefined, true);
    expect(fixture.nativeElement.querySelector('#unitActiveFilter').textContent).toContain('Com baixa');
  });

  it('should change to retired units and clear the previous selection', async () => {
    component.selectedItemUnitIds = [1];
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('#unitActiveFilter');
    select.selectedIndex = 1;
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(component.filterActive).toBeFalse();
    expect(component.selectedItemUnitIds).toEqual([]);
    expect(units.list).toHaveBeenCalledWith(component.pagination, '', undefined, false);
  });

  it('should allow viewing all units', async () => {
    const select: HTMLSelectElement = fixture.nativeElement.querySelector('#unitActiveFilter');
    select.selectedIndex = 2;
    select.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(component.filterActive).toBeUndefined();
    expect(units.list).toHaveBeenCalledWith(component.pagination, '', undefined, undefined);
  });

  it('should refresh active units after confirming a retirement', () => {
    const unit = new ItemUnit();
    unit.id = 1;
    component.retireUnit(unit);
    expect(units.delete).not.toHaveBeenCalled();
    confirmation.confirm.calls.mostRecent().args[0].accept!();
    expect(units.delete).toHaveBeenCalledWith(1);
    expect(grid.reset).toHaveBeenCalled();
    expect(units.list).toHaveBeenCalledWith(component.pagination, '', undefined, true);
  });

  it('should refresh after retiring multiple units', () => {
    component.selectedItemUnitIds = [1, 2];
    component.retireSelectedUnits();
    confirmation.confirm.calls.mostRecent().args[0].accept!();
    expect(units.deleteAll).toHaveBeenCalledWith([1, 2]);
    expect(component.selectedItemUnitIds).toEqual([]);
    expect(units.list).toHaveBeenCalledWith(component.pagination, '', undefined, true);
  });

  it('should refresh the retired list after reactivation', () => {
    component.filterActive = false;
    const unit = new ItemUnit();
    unit.id = 1;
    unit.active = false;
    component.reactivate(unit);
    expect(units.changeActive).toHaveBeenCalledWith(1, true);
    expect(grid.reset).toHaveBeenCalled();
    expect(units.list).toHaveBeenCalledWith(component.pagination, '', undefined, false);
  });

  it('should export with the same filters as the list', () => {
    component.filterActive = false;
    component.filterName = 'Notebook';
    component.itemId = 44;
    component.loadItemUnitsForExport(component.pagination).subscribe();
    expect(units.list).toHaveBeenCalledWith(component.pagination, 'Notebook', 44, false);
  });
});
