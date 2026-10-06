export class StockBalance {
  id?: number;
  version?: number;
  itemId?: number;
  itemName: string = '';
  totalQuantity: number = 0;
  unavailableQuantity: number = 0;
  availableQuantity: number = 0;
  maintenanceQuantity: number = 0;
  damagedQuantity: number = 0;
  lostQuantity: number = 0;
  minimumQuantity: number = 0;
  lowStock: boolean = false;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;

  constructor(stockBalance?: StockBalance) {
    if (stockBalance != null) {
      this.id = stockBalance.id;
      this.version = stockBalance.version;
      this.itemId = stockBalance.itemId;
      this.itemName = stockBalance.itemName;
      this.totalQuantity = stockBalance.totalQuantity;
      this.unavailableQuantity = stockBalance.unavailableQuantity;
      this.availableQuantity = stockBalance.availableQuantity;
      this.maintenanceQuantity = stockBalance.maintenanceQuantity;
      this.damagedQuantity = stockBalance.damagedQuantity;
      this.lostQuantity = stockBalance.lostQuantity;
      this.minimumQuantity = stockBalance.minimumQuantity;
      this.lowStock = stockBalance.lowStock;
      this.createdBy = stockBalance.createdBy;
      this.updatedBy = stockBalance.updatedBy;

      if (stockBalance.createdAt != null) {
        this.createdAt = new Date(stockBalance.createdAt);
      }

      if (stockBalance.updatedAt != null) {
        this.updatedAt = new Date(stockBalance.updatedAt);
      }
    }
  }
}
