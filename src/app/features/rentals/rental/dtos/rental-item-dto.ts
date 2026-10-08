export class RentalItemDTO {
  id?: number;
  itemId?: number;
  itemName?: string;
  quantity?: number;
  unitPrice?: number;
  discount?: number;
  additionalFee?: number;
  subtotal?: number;

  constructor(item?: Partial<RentalItemDTO>) {
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
