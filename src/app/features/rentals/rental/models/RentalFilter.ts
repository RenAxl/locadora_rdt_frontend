export class RentalFilter {
  number: string = '';
  customer: string = '';
  status: string = '';
  dateFrom: string = '';
  dateTo: string = '';
  rentalTypeId?: number | null;

  constructor(filter?: RentalFilter) {
    if (filter != null) {
      this.number = filter.number;
      this.customer = filter.customer;
      this.status = filter.status;
      this.dateFrom = filter.dateFrom;
      this.dateTo = filter.dateTo;
      this.rentalTypeId = filter.rentalTypeId;
    }
  }
}
