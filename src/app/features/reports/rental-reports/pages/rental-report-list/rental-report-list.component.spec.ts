import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from 'primeng/api';
import { AuthService } from 'src/app/core/auth/services/auth.service';
import { API } from 'src/app/core/config/api.config';

import { RentalReportsModule } from '../../rental-reports.module';
import { RentalReportListComponent } from './rental-report-list.component';

describe('RentalReportListComponent', () => {
  let fixture: ComponentFixture<RentalReportListComponent>;
  let component: RentalReportListComponent;
  let httpMock: HttpTestingController;
  let messageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    messageService = jasmine.createSpyObj('MessageService', ['add']);
    await TestBed.configureTestingModule({
      imports: [RentalReportsModule, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: MessageService, useValue: messageService },
        { provide: AuthService, useValue: { hasAuthority: () => true } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RentalReportListComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should load filter options and show monthly rental values', () => {
    fixture.detectChanges();
    httpMock.expectOne((req) => req.url === API.CUSTOMERS.ROOT).flush({ content: [{ id: 1, name: 'Ana' }] });
    httpMock.expectOne((req) => req.url === `${API.BASE}/rental/rentaltypes`).flush({ content: [{ id: 2, name: 'Diária' }] });
    httpMock.expectOne((req) => req.url === API.PAYMENT_METHODS.ROOT).flush({ content: [{ id: 3, name: 'Pix' }] });
    httpMock.expectOne((req) => req.url === API.RENTAL_REPORTS.COMPARISON).flush({
      rentalTotal: 125, paidTotal: 125, rentalCount: 1, paidCount: 1, year: 2026,
      months: [{ month: 1, label: 'Jan', rentalTotal: 125, paidTotal: 125 }],
    });
    fixture.detectChanges();

    expect(component.customers[0].name).toBe('Ana');
    expect(component.rentalTypes[0].name).toBe('Diária');
    expect(component.paymentMethods[0].name).toBe('Pix');
    expect(component.comparison.paidTotal).toBe(125);
    expect(component.chartLoading).toBeFalse();
    expect(fixture.nativeElement.querySelector('.month-label').textContent).toContain('Jan');
    expect(fixture.nativeElement.textContent).toContain('Relatórios de locações');
  });

  it('should reject an inverted period before requesting a report', () => {
    component.filters.startDate = '2026-07-31';
    component.filters.endDate = '2026-07-01';

    component.generate('pdf');

    expect(messageService.add).toHaveBeenCalledWith({ severity: 'warn', detail: 'Data inicial não pode ser maior que a data final.' });
    expect(component.loading).toBeFalse();
    httpMock.expectNone((req) => req.url.includes('/reports/rental-reports'));
  });

  it('should release loading when file generation fails', () => {
    component.generate('pdf');
    const request = httpMock.expectOne((req) => req.url === API.RENTAL_REPORTS.GENERATE('rentals', 'pdf'));
    request.flush(new Blob(), { status: 500, statusText: 'Server Error' });

    expect(component.loading).toBeFalse();
  });

  it('should clear old comparison when loading fails', () => {
    component.comparison.rentalTotal = 100;
    component.loadComparison();
    const request = httpMock.expectOne((req) => req.url === API.RENTAL_REPORTS.COMPARISON);
    request.flush({}, { status: 500, statusText: 'Server Error' });

    expect(component.comparison.rentalTotal).toBe(0);
    expect(component.comparison.months.length).toBe(0);
    expect(component.chartLoading).toBeFalse();
  });
});
