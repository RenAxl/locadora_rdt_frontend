export class RentalTypeUpdateDTO {
  id?: number;

  name: string = '';

  type: string = '';

  days?: number;

  constructor(rentalType?: Partial<RentalTypeUpdateDTO>) {
    if (rentalType != null) {
      this.id = rentalType.id;

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
