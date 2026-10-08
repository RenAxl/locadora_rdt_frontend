export class RentalTypeInsertDTO {
  name: string = '';

  type: string = '';

  days?: number;

  constructor(rentalType?: Partial<RentalTypeInsertDTO>) {
    if (rentalType != null) {
      if (rentalType.name != null) {
        this.name = rentalType.name;
      }

      if (rentalType.type != null) {
        this.type = rentalType.type;
      }

      if (rentalType.days != null) {
        this.days = rentalType.days;
      }
    }
  }
}
