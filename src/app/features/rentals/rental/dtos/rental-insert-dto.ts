import { RentalItemInsertDTO } from './rental-item-insert-dto';

export class RentalInsertDTO {
  rentalTypeId?: number;

  rentalStartDate?: string;

  returnForecastDate?: string;

  shippingFee: number = 0;

  additionalFee: number = 0;

  downPayment: number = 0;

  items: RentalItemInsertDTO[] = [];

  constructor(rental?: Partial<RentalInsertDTO>) {
    if (rental != null) {
      this.rentalTypeId = rental.rentalTypeId;
      this.rentalStartDate = rental.rentalStartDate;
      this.returnForecastDate = rental.returnForecastDate;
      if (rental.shippingFee != null) {
        this.shippingFee = rental.shippingFee;
      }

      if (rental.additionalFee != null) {
        this.additionalFee = rental.additionalFee;
      }

      if (rental.downPayment != null) {
        this.downPayment = rental.downPayment;
      }

      if (rental.items != null) {
        this.items = rental.items;
      }

    }
  }
}
