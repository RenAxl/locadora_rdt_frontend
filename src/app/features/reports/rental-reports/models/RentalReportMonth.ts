export class RentalReportMonth {
  month: number = 0;
  label: string = '';
  rentalTotal: number = 0;
  paidTotal: number = 0;

  constructor(month?: RentalReportMonth) {
    if (month != null) {
      this.month = month.month;
      this.label = month.label;
      this.rentalTotal = month.rentalTotal;
      this.paidTotal = month.paidTotal;
    }
  }
}
