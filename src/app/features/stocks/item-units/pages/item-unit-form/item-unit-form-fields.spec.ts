import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';
import { MessageComponent } from 'src/app/shared/components/message/message.component';
import { Item } from '../../../items/models/Item';
import { ItemService } from '../../../items/services/item.service';
import { ItemUnitService } from '../../services/item-unit.service';
import { ItemUnitFormComponent } from './item-unit-form.component';

describe('ItemUnitFormComponent automatic asset code', () => {
  let fixture: ComponentFixture<ItemUnitFormComponent>;
  let component: ItemUnitFormComponent;
  let units: jasmine.SpyObj<ItemUnitService>;
  let router: Router;

  beforeEach(async () => {
    units = jasmine.createSpyObj('ItemUnitService', ['insert', 'update', 'findById']);
    units.insert.and.returnValue(of({ id: 1, assetCode: 'ITEM-44-1234abcd' }));
    units.update.and.returnValue(of({ id: 1, assetCode: 'ITEM-44-1234abcd' }));
    const items = jasmine.createSpyObj<ItemService>('ItemService', ['list']);
    items.list.and.returnValue(of({ content: [{ id: 44, name: 'Notebook', active: true }], totalElements: 1 }));

    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, RouterTestingModule],
      declarations: [ItemUnitFormComponent, MessageComponent],
      providers: [
        { provide: ItemUnitService, useValue: units },
        { provide: ItemService, useValue: items },
        { provide: MessageService, useValue: jasmine.createSpyObj('MessageService', ['add']) },
      ],
    }).compileComponents();

    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    fixture = TestBed.createComponent(ItemUnitFormComponent);
    component = fixture.componentInstance;
    component.unit.item = new Item();
    component.unit.item.id = 44;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should omit asset code and serial number inputs from the form', () => {
    expect(fixture.nativeElement.querySelector('[name="assetCode"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[name="serialNumber"]')).toBeNull();
    expect(fixture.nativeElement.textContent).not.toContain('Código patrimonial');
    expect(fixture.nativeElement.textContent).not.toContain('Número de série');
  });

  it('should submit a valid unit without asset code or serial number', () => {
    const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);
    expect(form.valid).toBeTrue();
    component.save(form);
    const dto = units.insert.calls.mostRecent().args[0];
    expect(dto.itemId).toBe(44);
    expect(dto.conditionStatus).toBe('GOOD');
    expect('assetCode' in dto).toBeFalse();
    expect('serialNumber' in dto).toBeFalse();
    expect(component.unit.assetCode).toBe('ITEM-44-1234abcd');
    expect(router.navigate).toHaveBeenCalled();
  });

  it('should exclude the existing generated code from the update request', () => {
    component.unit.id = 1;
    component.unit.assetCode = 'ITEM-44-1234abcd';
    component.unit.notes = 'Conservação revisada';
    component.update();
    const dto = units.update.calls.mostRecent().args[0];
    expect(dto.id).toBe(1);
    expect(dto.itemId).toBe(44);
    expect(dto.notes).toBe('Conservação revisada');
    expect('assetCode' in dto).toBeFalse();
    expect('serialNumber' in dto).toBeFalse();
    expect(component.unit.assetCode).toBe('ITEM-44-1234abcd');
  });

  it('should block registration without an item', async () => {
    component.unit.item = undefined;
    fixture.detectChanges();
    await fixture.whenStable();
    const form = fixture.debugElement.query(By.directive(NgForm)).injector.get(NgForm);
    component.save(form);
    expect(form.invalid).toBeTrue();
    expect(units.insert).not.toHaveBeenCalled();
  });
});
