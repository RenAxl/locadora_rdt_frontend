export class ItemUnitUpdateDTO {
  id?: number;

  itemId?: number | null;
  assetCode: string = '';
  serialNumber?: string | null;
  conditionStatus: string = 'GOOD';
  purchaseDate?: string | null;
  notes: string = '';

  constructor(unit?: Partial<ItemUnitUpdateDTO>) {
    if (unit != null) {
      this.id = unit.id;
      this.itemId = unit.itemId;
      this.serialNumber = unit.serialNumber;
      this.purchaseDate = unit.purchaseDate;

      if (unit.assetCode != null) {
        this.assetCode = unit.assetCode;
      }

      if (unit.conditionStatus != null) {
        this.conditionStatus = unit.conditionStatus;
      }

      if (unit.notes != null) {
        this.notes = unit.notes;
      }
    }
  }
}
