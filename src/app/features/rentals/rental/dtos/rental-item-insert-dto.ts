export class RentalItemInsertDTO {
  itemId: number = 0;
  quantity: number = 1;
  discount: number = 0;
  additionalFee: number = 0;

  constructor(item?: Partial<RentalItemInsertDTO>) {
    if (item != null) {
      if (item.itemId != null) {
        this.itemId = item.itemId;
      }

      if (item.quantity != null) {
        this.quantity = item.quantity;
      }

      if (item.discount != null) {
        this.discount = item.discount;
      }

      if (item.additionalFee != null) {
        this.additionalFee = item.additionalFee;
      }

    }
  }
}
