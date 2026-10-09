export class RentalReportMonthDTO {
  month?: number;
  label?: string;
  rentalTotal?: number;
  paidTotal?: number;

  constructor(month?: Partial<RentalReportMonthDTO>) {
    if (month != null) {
      this.month = month.month;
      this.label = month.label;
      this.rentalTotal = month.rentalTotal;
      this.paidTotal = month.paidTotal;
    }
  }
}
