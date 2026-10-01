import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import {
  PayableQuickPeriodFilterComponent,
  PayableQuickPeriodRange,
} from './payable-quick-period-filter.component';

describe('PayableQuickPeriodFilterComponent', () => {
  let component: PayableQuickPeriodFilterComponent;
  let fixture: ComponentFixture<PayableQuickPeriodFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayableQuickPeriodFilterComponent],
      imports: [CommonModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PayableQuickPeriodFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit current day when today is selected', () => {
    const today = new Date();
    const expectedDate = `${today.getFullYear()}-${`${today.getMonth() + 1}`.padStart(2, '0')}-${`${today.getDate()}`.padStart(2, '0')}`;
    let emittedRange: PayableQuickPeriodRange | undefined;

    component.periodChange.subscribe((range) => {
      emittedRange = range;
    });

    component.selectPeriod('TODAY');

    expect(emittedRange?.startDate).toBe(expectedDate);
    expect(emittedRange?.endDate).toBe(expectedDate);
  });

  it('keeps the week range when Monday belongs to the previous month', () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2026, 8, 1, 12));
    let range: PayableQuickPeriodRange | undefined;
    component.periodChange.subscribe((data) => {
      range = data;
    });

    try {
      component.selectPeriod('THIS_WEEK');
      expect(range).toEqual({ startDate: '2026-08-31', endDate: '2026-09-06' });
    } finally {
      jasmine.clock().uninstall();
    }
  });

  it('keeps the next week range across the end of the year', () => {
    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(2026, 11, 31, 12));
    let range: PayableQuickPeriodRange | undefined;
    component.periodChange.subscribe((data) => {
      range = data;
    });

    try {
      component.selectPeriod('NEXT_WEEK');
      expect(range).toEqual({ startDate: '2027-01-04', endDate: '2027-01-10' });
    } finally {
      jasmine.clock().uninstall();
    }
  });
});
