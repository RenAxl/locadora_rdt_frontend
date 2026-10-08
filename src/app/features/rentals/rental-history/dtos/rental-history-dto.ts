import { RentalItemDTO } from '../../rental/dtos/rental-item-dto';

export class RentalHistoryDTO {
  id?: number;

  rentalNumber?: string;
  rentalTypeName?: string;
  status?: string;

  registrationDate?: Date;
  rentalStartDate?: Date;
  returnForecastDate?: Date;
  effectiveReturnDate?: Date;

  totalAmount?: number;
  paid?: boolean;

  items?: RentalItemDTO[];

  constructor(rentalHistory?: Partial<RentalHistoryDTO>) {
    if (rentalHistory != null) {
      this.id = rentalHistory.id;
      this.rentalNumber = rentalHistory.rentalNumber;
      this.rentalTypeName = rentalHistory.rentalTypeName;
      this.status = rentalHistory.status;
      this.totalAmount = rentalHistory.totalAmount;
      this.paid = rentalHistory.paid;
      this.items = rentalHistory.items;

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
    }
  }
}
