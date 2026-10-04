export class ItemUnitDTO {
  id?: number;
  itemId?: number;
  itemName?: string;
  assetCode?: string;
  serialNumber?: string | null;
  status?: string;
  conditionStatus?: string;
  active?: boolean;

  constructor(unit?: Partial<ItemUnitDTO>) {
    if (unit != null) {
      this.id = unit.id;
      this.itemId = unit.itemId;
      this.itemName = unit.itemName;
      this.assetCode = unit.assetCode;
      this.serialNumber = unit.serialNumber;
      this.status = unit.status;
      this.conditionStatus = unit.conditionStatus;
      this.active = unit.active;
    }
  }
}
