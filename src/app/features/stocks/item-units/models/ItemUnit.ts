import { Item } from '../../items/models/Item';

export class ItemUnit {
  id?: number;
  version?: number;
  item?: Item;
  assetCode: string = '';
  serialNumber?: string | null;
  status: string = 'AVAILABLE';
  conditionStatus: string = 'GOOD';
  purchaseDate?: string | null;
  notes: string = '';
  active: boolean = true;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;

  constructor(unit?: ItemUnit) {
    if (unit != null) {
      this.id = unit.id;
      this.version = unit.version;
      this.assetCode = unit.assetCode;
      this.serialNumber = unit.serialNumber;
      this.status = unit.status;
      this.conditionStatus = unit.conditionStatus;
      this.purchaseDate = unit.purchaseDate;
      this.notes = unit.notes;
      this.active = unit.active;
      this.createdBy = unit.createdBy;
      this.updatedBy = unit.updatedBy;

      if (unit.item != null) {
        this.item = new Item(unit.item);
      }

      if (unit.createdAt != null) {
        this.createdAt = new Date(unit.createdAt);
      }

      if (unit.updatedAt != null) {
        this.updatedAt = new Date(unit.updatedAt);
      }
    }
  }
}
