import { RentalReportMonthDTO } from './rental-report-month-dto';

export class RentalReportDTO {
  rentalTotal?: number;
  paidTotal?: number;
  rentalCount?: number;
  paidCount?: number;
  year?: number;
  months?: RentalReportMonthDTO[];

  constructor(report?: Partial<RentalReportDTO>) {
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
