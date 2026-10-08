export class RentalType {
  id?: number;
  version?: number;
  name: string = '';
  type: string = '';
  days?: number;
  active: boolean = true;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;

  constructor(rentalType?: RentalType) {
    if (rentalType != null) {
      this.id = rentalType.id;
      this.version = rentalType.version;
      this.name = rentalType.name;
      this.type = rentalType.type;
      this.days = rentalType.days;
      this.active = rentalType.active;
      this.createdBy = rentalType.createdBy;
      this.updatedBy = rentalType.updatedBy;

      if (rentalType.createdAt != null) {
        this.createdAt = new Date(rentalType.createdAt);
      }

      if (rentalType.updatedAt != null) {
        this.updatedAt = new Date(rentalType.updatedAt);
      }
    }
  }
}
