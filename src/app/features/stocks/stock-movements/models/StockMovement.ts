export class StockMovement {
  id?: number;
  itemId?: number;
  itemUnitId?: number | null;
  assetCode?: string | null;
  previousStatus?: string | null;
  newStatus?: string | null;
  status?: string | null;
  itemName: string = '';
  type: string = 'ENTRY';
  quantity?: number | null;
  reason?: string | null;
  createdAt?: Date;
  createdBy?: string | null;

  constructor(stockMovement?: StockMovement) {
    if (stockMovement != null) {
      this.id = stockMovement.id;
      this.itemId = stockMovement.itemId;
      this.itemUnitId = stockMovement.itemUnitId;
      this.assetCode = stockMovement.assetCode;
      this.previousStatus = stockMovement.previousStatus;
      this.newStatus = stockMovement.newStatus;
      this.status = stockMovement.status;
      this.itemName = stockMovement.itemName;
      this.type = stockMovement.type;
      this.quantity = stockMovement.quantity;
      this.reason = stockMovement.reason;
      this.createdBy = stockMovement.createdBy;

      if (stockMovement.createdAt != null) {
        this.createdAt = new Date(stockMovement.createdAt);
      }
    }
  }
}
