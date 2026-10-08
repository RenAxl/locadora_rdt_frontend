export class RentalItem {
  id?: number;
  itemId: number = 0;
  itemName: string = '';
  quantity: number = 1;
  unitPrice: number = 0;
  discount: number = 0;
  additionalFee: number = 0;
  subtotal: number = 0;

  constructor(item?: RentalItem) {
    if (item != null) {
      this.id = item.id;
      this.itemId = item.itemId;
      this.itemName = item.itemName;
      this.quantity = item.quantity;
      this.unitPrice = item.unitPrice;
      this.discount = item.discount;
      this.additionalFee = item.additionalFee;
      this.subtotal = item.subtotal;
    }
  }
}
