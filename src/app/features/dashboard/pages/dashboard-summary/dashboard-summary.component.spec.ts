import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { API } from 'src/app/core/config/api.config';
import { FinancialReport } from 'src/app/features/reports/financial-reports/models/FinancialReport';
import { FinancialReportMonth } from 'src/app/features/reports/financial-reports/models/FinancialReportMonth';
import { DashboardModule } from '../../dashboard.module';
import { Dashboard } from '../../models/Dashboard';
import { DashboardDailyRental } from '../../models/DashboardDailyRental';
import { DashboardSummaryComponent } from './dashboard-summary.component';

describe('DashboardSummaryComponent', () => {
  let fixture: ComponentFixture<DashboardSummaryComponent>;
  let component: DashboardSummaryComponent;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardModule, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardSummaryComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load and render dashboard and financial indicators', () => {
    fixture.detectChanges();
    expect(component.loading).toBeTrue();
    expect(component.chartLoading).toBeTrue();

    const summaryRequest = httpMock.expectOne(`${API.BASE}/dashboard`);
    expect(summaryRequest.request.method).toBe('GET');
    summaryRequest.flush({
      availableGames: 12,
      activeConsoles: 4,
      activeRentals: 8,
      returnsToday: 2,
      activeCustomers: 20,
      overdueRentals: 3,
      dailyRentals: [
        { date: '2026-10-03', label: 'Sáb', quantity: 1 },
        { date: '2026-10-04', label: 'Dom', quantity: 2 },
        { date: '2026-10-05', label: 'Seg', quantity: 3 },
        { date: '2026-10-06', label: 'Ter', quantity: 4 },
        { date: '2026-10-07', label: 'Qua', quantity: 5 },
        { date: '2026-10-08', label: 'Qui', quantity: 6 },
        { date: '2026-10-09', label: 'Sex', quantity: 7 },
      ],
    });

    const comparisonRequest = httpMock.expectOne((request) => {
      return request.url === API.FINANCIAL_REPORTS.COMPARISON;
    });
    expect(comparisonRequest.request.method).toBe('GET');
    expect(comparisonRequest.request.params.get('year')).toBe(new Date().getFullYear().toString());
    expect(comparisonRequest.request.params.get('status')).toBe('ALL');
    expect(comparisonRequest.request.params.get('periodType')).toBe('DUE_DATE');
    comparisonRequest.flush({
      receivableTotal: 150,
      payableTotal: 50,
      balance: 100,
      receivableCount: 2,
      payableCount: 1,
      year: 2026,
      months: [
        { month: 1, label: 'Jan', receivableTotal: 150, payableTotal: 50 },
      ],
    });
    fixture.detectChanges();

    expect(component.dashboard instanceof Dashboard).toBeTrue();
    expect(component.dashboard.dailyRentals[0] instanceof DashboardDailyRental).toBeTrue();
    expect(component.dashboard.dailyRentals[0].date).toBe('2026-10-03');
    expect(component.comparison instanceof FinancialReport).toBeTrue();
    expect(component.loading).toBeFalse();
    expect(component.chartLoading).toBeFalse();
    expect(component.weeklyTotal).toBe(28);
    expect(component.weeklyAverage).toBe(4);
    expect(component.weeklyPeak).toBe('Sex');

    const page: HTMLElement = fixture.nativeElement;
    const cards = page.querySelectorAll('.figure-card');
    expect(cards.length).toBe(6);
    expect(cards[0].querySelector('.figure-value')?.textContent?.trim()).toBe('12');
    expect(cards[1].querySelector('.figure-value')?.textContent?.trim()).toBe('4');
    expect(cards[2].querySelector('.figure-value')?.textContent?.trim()).toBe('8');
    expect(cards[3].querySelector('.figure-value')?.textContent?.trim()).toBe('2');
    expect(cards[4].querySelector('.figure-value')?.textContent?.trim()).toBe('20');
    expect(cards[5].querySelector('.figure-value')?.textContent?.trim()).toBe('3');
    expect(page.querySelectorAll('.chart-bars .bar').length).toBe(7);
    expect(page.querySelectorAll('.month-group').length).toBe(1);
    expect(page.querySelector('.summary-item.balance')?.classList.contains('positive')).toBeTrue();
    const receivableColumn = page.querySelector<HTMLElement>('.month-column.receivable');
    expect(receivableColumn?.style.height).toBe('75%');
    expect(page.querySelector('.loading-label')).toBeNull();
  });

  it('should finish loading and preserve displayed values when requests fail', () => {
    component.dashboard.availableGames = 12;
    component.comparison.receivableTotal = 150;
    fixture.detectChanges();

    const summaryRequest = httpMock.expectOne(`${API.BASE}/dashboard`);
    summaryRequest.flush('Erro no banco', { status: 500, statusText: 'Internal Server Error' });
    const comparisonRequest = httpMock.expectOne((request) => {
      return request.url === API.FINANCIAL_REPORTS.COMPARISON;
    });
    comparisonRequest.flush('Sem permissão', { status: 403, statusText: 'Forbidden' });

    expect(component.loading).toBeFalse();
    expect(component.chartLoading).toBeFalse();
    expect(component.dashboard.availableGames).toBe(12);
    expect(component.comparison.receivableTotal).toBe(150);
  });

  it('should show zero metrics and empty charts before data arrives', () => {
    expect(component.weeklyTotal).toBe(0);
    expect(component.weeklyAverage).toBe(0);
    expect(component.weeklyPeak).toBe('-');
    expect(component.weeklyBarHeight(0)).toBe('0%');
    expect(component.chartMaxValue).toBe(100);
    expect(component.chartColumnHeight(0)).toBe('0%');
    expect(component.balanceClass).toBe('neutral');
  });

  it('should preserve the first peak on ties and the minimum weekly bar height', () => {
    component.dashboard.dailyRentals = [
      new DashboardDailyRental({ date: '2026-10-05', label: 'Seg', quantity: 100 }),
      new DashboardDailyRental({ date: '2026-10-06', label: 'Ter', quantity: 100 }),
      new DashboardDailyRental({ date: '2026-10-07', label: 'Qua', quantity: 1 }),
      new DashboardDailyRental({ date: '2026-10-08', label: 'Qui', quantity: 0 }),
    ];

    expect(component.weeklyTotal).toBe(201);
    expect(component.weeklyAverage).toBe(50.25);
    expect(component.weeklyPeak).toBe('Seg');
    expect(component.weeklyBarHeight(100)).toBe('100%');
    expect(component.weeklyBarHeight(1)).toBe('4%');
    expect(component.weeklyBarHeight(0)).toBe('0%');
  });

  it('should scale both financial series and preserve the minimum column height', () => {
    component.comparison.year = 2026;
    component.comparison.balance = -50;
    component.comparison.months = [
      new FinancialReportMonth({ month: 1, label: 'Jan', receivableTotal: 150, payableTotal: 301 }),
    ];

    expect(component.chartYear).toBe(2026);
    expect(component.balanceClass).toBe('negative');
    expect(component.chartMaxValue).toBe(400);
    expect(component.chartTickValue(0.75)).toBe(300);
    expect(component.chartColumnHeight(150)).toBe('37.5%');
    expect(component.chartColumnHeight(1)).toBe('2%');
    expect(component.chartColumnHeight(0)).toBe('0%');
  });
});
