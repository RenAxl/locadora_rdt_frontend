import { Component, OnInit } from '@angular/core';
import { FinancialReportFilterDTO } from 'src/app/features/reports/financial-reports/dtos/financial-report-filter-dto';
import { FinancialReportMapper } from 'src/app/features/reports/financial-reports/mapper/financial-report.mapper';
import { FinancialReport } from 'src/app/features/reports/financial-reports/models/FinancialReport';
import { FinancialReportService } from 'src/app/features/reports/financial-reports/services/financial-report.service';
import { DashboardMapper } from '../../mapper/dashboard.mapper';
import { Dashboard } from '../../models/Dashboard';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-dashboard-summary',
  templateUrl: './dashboard-summary.component.html',
  styleUrls: ['./dashboard-summary.component.css'],
})
export class DashboardSummaryComponent implements OnInit {
  dashboard: Dashboard = new Dashboard();

  comparison: FinancialReport = new FinancialReport();

  loading: boolean = false;

  chartLoading: boolean = false;

  constructor(
    private dashboardService: DashboardService,
    private financialReportService: FinancialReportService,
  ) {}

  ngOnInit(): void {
    this.loadSummary();
    this.loadComparison();
  }

  loadSummary(): void {
    this.loading = true;

    this.dashboardService.getSummary().subscribe({
      next: (data) => {
        const dashboard = DashboardMapper.toModel(data);
        this.dashboard = dashboard;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  loadComparison(): void {
    const filters = new FinancialReportFilterDTO();
    filters.year = new Date().getFullYear();
    filters.status = 'ALL';
    filters.periodType = 'DUE_DATE';

    this.chartLoading = true;

    this.financialReportService.comparison(filters).subscribe({
      next: (data) => {
        const comparison = FinancialReportMapper.toModel(data);
        this.comparison = comparison;
        this.chartLoading = false;
      },
      error: () => {
        this.chartLoading = false;
      },
    });
  }

  get weeklyTotal(): number {
    let total = 0;

    for (const day of this.dashboard.dailyRentals) {
      total = total + day.quantity;
    }

    return total;
  }

  get weeklyAverage(): number {
    const numberOfDays = this.dashboard.dailyRentals.length;

    if (numberOfDays === 0) {
      return 0;
    }

    const total = this.weeklyTotal;

    return total / numberOfDays;
  }

  get weeklyPeak(): string {
    if (this.dashboard.dailyRentals.length === 0 || this.weeklyTotal === 0) {
      return '-';
    }

    let peak = this.dashboard.dailyRentals[0];

    for (const day of this.dashboard.dailyRentals) {
      if (day.quantity > peak.quantity) {
        peak = day;
      }
    }

    return peak.label;
  }

  weeklyBarHeight(quantity: number): string {
    let maximum = 0;

    for (const day of this.dashboard.dailyRentals) {
      if (day.quantity > maximum) {
        maximum = day.quantity;
      }
    }

    if (maximum === 0) {
      return '0%';
    }

    let height = (quantity / maximum) * 100;

    if (quantity !== 0 && height < 4) {
      height = 4;
    }

    return height + '%';
  }

  get chartYear(): number {
    if (this.comparison.year) {
      return this.comparison.year;
    }

    return new Date().getFullYear();
  }

  get balanceClass(): string {
    if (this.comparison.balance > 0) {
      return 'positive';
    }

    if (this.comparison.balance < 0) {
      return 'negative';
    }

    return 'neutral';
  }

  get chartMaxValue(): number {
    let maximum = 0;

    for (const month of this.comparison.months) {
      if (month.receivableTotal > maximum) {
        maximum = month.receivableTotal;
      }

      if (month.payableTotal > maximum) {
        maximum = month.payableTotal;
      }
    }

    if (maximum <= 0) {
      return 100;
    }

    return Math.ceil(maximum / 100) * 100;
  }

  chartColumnHeight(value: number): string {
    const maximum = this.chartMaxValue;

    if (maximum <= 0 || value <= 0) {
      return '0%';
    }

    let height = (value / maximum) * 100;

    if (height < 2) {
      height = 2;
    }

    return height + '%';
  }

  chartTickValue(multiplier: number): number {
    const maximum = this.chartMaxValue;

    return maximum * multiplier;
  }
}
