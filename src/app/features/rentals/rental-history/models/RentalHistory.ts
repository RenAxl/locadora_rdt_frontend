import { RentalItem } from '../../rental/models/RentalItem';

export class RentalHistory {
  id?: number;
  rentalNumber: string = '';
  rentalTypeName: string = '';
  status: string = '';
  registrationDate?: Date;
  rentalStartDate?: Date;
  returnForecastDate?: Date;
  effectiveReturnDate?: Date;
  totalAmount: number = 0;
  paid: boolean = false;
  items: RentalItem[] = [];

  constructor(rentalHistory?: RentalHistory) {
    if (rentalHistory != null) {
      this.id = rentalHistory.id;
      this.rentalNumber = rentalHistory.rentalNumber;
      this.rentalTypeName = rentalHistory.rentalTypeName;
      this.status = rentalHistory.status;
      this.totalAmount = rentalHistory.totalAmount;
      this.paid = rentalHistory.paid;

      if (rentalHistory.registrationDate != null) {
        this.registrationDate = new Date(rentalHistory.registrationDate);
      }

      if (rentalHistory.rentalStartDate != null) {
        this.rentalStartDate = new Date(rentalHistory.rentalStartDate);
      }

      if (rentalHistory.returnForecastDate != null) {
        this.returnForecastDate = new Date(rentalHistory.returnForecastDate);
      }

      if (rentalHistory.effectiveReturnDate != null) {
        this.effectiveReturnDate = new Date(rentalHistory.effectiveReturnDate);
      }

      if (rentalHistory.items != null) {
        for (const item of rentalHistory.items) {
          this.items.push(new RentalItem(item));
        }
      }
    }
  }
}
