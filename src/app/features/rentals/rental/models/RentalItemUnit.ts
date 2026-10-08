export class RentalItemUnit {
  id?: number;
  rentalItemId?: number;
  itemUnitId?: number;
  itemName: string = '';
  assetCode: string = '';
  status: string = '';
  reservedAt?: Date;
  deliveredAt?: Date;
  returnedAt?: Date;

  constructor(unit?: RentalItemUnit) {
    if (unit != null) {
      this.id = unit.id;
      this.rentalItemId = unit.rentalItemId;
      this.itemUnitId = unit.itemUnitId;
      this.itemName = unit.itemName;
      this.assetCode = unit.assetCode;
      this.status = unit.status;
      if (unit.reservedAt != null) {
        this.reservedAt = new Date(unit.reservedAt);
      }

      if (unit.deliveredAt != null) {
        this.deliveredAt = new Date(unit.deliveredAt);
      }

      if (unit.returnedAt != null) {
        this.returnedAt = new Date(unit.returnedAt);
      }

    }
  }
}
