export class CartItem {
  itemId: number = 0;
  itemName: string = '';
  unitPrice: number = 0;
  quantity: number = 0;
  totalQuantity: number = 0;

  constructor(item?: CartItem) {
    if (item != null) {
      this.itemId = item.itemId;
      this.itemName = item.itemName;
      this.unitPrice = item.unitPrice;
      this.quantity = item.quantity;
      this.totalQuantity = item.totalQuantity;
    }
  }
}
