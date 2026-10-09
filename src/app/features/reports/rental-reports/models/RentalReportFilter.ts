export class RentalReportFilter {
  search: string = '';
  startDate: string | null = null;
  endDate: string | null = null;
  status: string = 'ALL';
  periodType: string = 'REGISTRATION_DATE';
  customerId: number | null = null;
  rentalTypeId: number | null = null;
  paymentMethodId: number | null = null;
  minimumAmount: number | null = null;
  maximumAmount: number | null = null;
  year: number | null = new Date().getFullYear();

  constructor(filter?: RentalReportFilter) {
    if (filter != null) {
      this.search = filter.search;
      this.startDate = filter.startDate;
      this.endDate = filter.endDate;
      this.status = filter.status;
      this.periodType = filter.periodType;
      this.customerId = filter.customerId;
      this.rentalTypeId = filter.rentalTypeId;
      this.paymentMethodId = filter.paymentMethodId;
      this.minimumAmount = filter.minimumAmount;
      this.maximumAmount = filter.maximumAmount;
      this.year = filter.year;
    }
  }
}
