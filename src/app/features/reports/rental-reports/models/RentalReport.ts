import { RentalReportMonth } from './RentalReportMonth';

export class RentalReport {
  rentalTotal: number = 0;
  paidTotal: number = 0;
  rentalCount: number = 0;
  paidCount: number = 0;
  year: number = new Date().getFullYear();
  months: RentalReportMonth[] = [];

  constructor(report?: RentalReport) {
    if (report != null) {
      this.rentalTotal = report.rentalTotal;
      this.paidTotal = report.paidTotal;
      this.rentalCount = report.rentalCount;
      this.paidCount = report.paidCount;
      this.year = report.year;
      this.months = report.months;
    }
  }
}
